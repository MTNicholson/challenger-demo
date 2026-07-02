import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { AUTH_SESSION_DAYS, BRAND_AUTH_COOKIE_NAME, normalizeIdentifier, toPublicBrandMember } from "@/lib/auth-shared";
import { createBrandSessionToken } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeSlug(value: string) {
  return (
    value
      .trim()
      .toLocaleLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "brand"
  );
}

async function createUniqueBrandSlug(name: string) {
  const base = makeSlug(name);
  let slug = base;
  let index = 2;

  while (await prisma.brand.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        password?: string;
        city?: string;
        address?: string;
        category?: string;
        description?: string;
        website?: string;
      }
    | null;

  const name = body?.name?.trim() ?? "";
  const email = normalizeIdentifier(body?.email ?? "");
  const password = body?.password ?? "";
  const city = body?.city?.trim() || null;
  const address = body?.address?.trim() || null;
  const category = body?.category?.trim() || null;
  const description = body?.description?.trim() || null;
  const website = body?.website?.trim() || null;

  if (!name || !email || !email.includes("@") || !password.trim() || !city || !address || !category) {
    return NextResponse.json({ error: "Заполните обязательные поля бренда." }, { status: 400 });
  }

  const existingMember = await prisma.brandMember.findUnique({ where: { email }, select: { id: true } });
  if (existingMember) {
    return NextResponse.json(
      { error: "Бренд с таким email уже зарегистрирован. Попробуйте войти." },
      { status: 409 },
    );
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const slug = await createUniqueBrandSlug(name);
    const { brand, member } = await prisma.$transaction(async (tx) => {
      const createdBrand = await tx.brand.create({
        data: {
          name,
          slug,
          category,
          city,
          address,
          description,
          website,
        },
      });

      const createdMember = await tx.brandMember.create({
        data: {
          brandId: createdBrand.id,
          email,
          passwordHash,
          role: "owner",
        },
      });

      return { brand: createdBrand, member: createdMember };
    });

    const response = NextResponse.json({ brand, member: toPublicBrandMember(member) }, { status: 201 });
    response.cookies.set(
      BRAND_AUTH_COOKIE_NAME,
      await createBrandSessionToken({ brandMemberId: member.id, brandId: brand.id }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: AUTH_SESSION_DAYS * 24 * 60 * 60,
      },
    );

    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Бренд с такими данными уже существует." }, { status: 409 });
    }

    return NextResponse.json({ error: "Не удалось зарегистрировать бренд. Попробуйте ещё раз." }, { status: 500 });
  }
}
