import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { AUTH_SESSION_DAYS, BRAND_AUTH_COOKIE_NAME, normalizeIdentifier, toPublicBrandMember } from "@/lib/auth-shared";
import { createBrandSessionToken } from "@/lib/auth-server";
import { getImageFile, saveBrandImage, validateBrandImage } from "@/lib/brand-upload-server";
import { getOptionalNumberField, isValidLatitude, isValidLongitude } from "@/lib/brand-settings-validation";
import { BRAND_CATEGORIES } from "@/lib/brand-visuals";
import { prisma } from "@/lib/prisma";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";

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

function getStringValue(source: FormData | Record<string, unknown> | null, key: string) {
  if (!source) return "";
  if (source instanceof FormData) {
    const value = source.get(key);
    return typeof value === "string" ? value.trim() : "";
  }

  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalStringValue(source: FormData | Record<string, unknown> | null, key: string) {
  return getStringValue(source, key) || null;
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
  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");
  const body = isMultipart
    ? await request.formData().catch(() => null)
    : ((await request.json().catch(() => null)) as Record<string, unknown> | null);

  const name = getStringValue(body, "name") || getStringValue(body, "brandName");
  const email = normalizeIdentifier(getStringValue(body, "email"));
  const password = getStringValue(body, "password");
  const city = getStringValue(body, "city");
  const address = getStringValue(body, "address");
  const fullAddress = getOptionalStringValue(body, "fullAddress");
  const lat = getOptionalNumberField(body, "lat");
  const lng = getOptionalNumberField(body, "lng");
  const geoProvider = getOptionalStringValue(body, "geoProvider");
  const geoPlaceId = getOptionalStringValue(body, "geoPlaceId");
  const category = getStringValue(body, "category");
  const description = getOptionalStringValue(body, "description");
  const website = getOptionalStringValue(body, "website");
  const logoFile = body instanceof FormData ? getImageFile(body, "logo") : null;
  const coverImageFile = body instanceof FormData
    ? getImageFile(body, "coverImage") ?? getImageFile(body, "cover")
    : null;

  if (!name || !email || !email.includes("@") || !password.trim() || !category || !city || !address) {
    return NextResponse.json({ error: "Заполните обязательные поля бренда." }, { status: 400 });
  }

  if (!BRAND_CATEGORIES.includes(category as (typeof BRAND_CATEGORIES)[number])) {
    return NextResponse.json({ error: "Выберите категорию компании из списка." }, { status: 400 });
  }

  if (!RUSSIAN_CITIES.includes(city as (typeof RUSSIAN_CITIES)[number])) {
    return NextResponse.json({ error: "Выберите город из списка." }, { status: 400 });
  }

  const logoError = logoFile ? validateBrandImage(logoFile, "Логотип") : null;
  const coverError = coverImageFile ? validateBrandImage(coverImageFile, "Промо-картинка") : null;
  if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
    return NextResponse.json({ error: "Проверьте координаты адреса." }, { status: 400 });
  }

  if (logoError || coverError) {
    return NextResponse.json({ error: logoError ?? coverError }, { status: 400 });
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
    const logoUrl = logoFile ? await saveBrandImage(logoFile, "logo") : null;
    const coverImageUrl = coverImageFile ? await saveBrandImage(coverImageFile, "cover") : null;
    const { brand, member } = await prisma.$transaction(async (tx) => {
      const createdBrand = await tx.brand.create({
        data: {
          name,
          slug,
          category,
          city,
          address,
          description,
          logoUrl,
          coverImageUrl,
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

      await tx.brandLocation.create({
        data: {
          brandId: createdBrand.id,
          name: "Первая точка",
          city,
          address,
          fullAddress,
          lat,
          lng,
          geoProvider,
          geoPlaceId,
          isMain: false,
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
