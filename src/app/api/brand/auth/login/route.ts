import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AUTH_SESSION_DAYS, BRAND_AUTH_COOKIE_NAME, normalizeIdentifier, toPublicBrandMember } from "@/lib/auth-shared";
import { createBrandSessionToken } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; rememberMe?: boolean }
    | null;

  const email = normalizeIdentifier(body?.email ?? "");
  const password = body?.password ?? "";
  const sessionDays = body?.rememberMe === true ? AUTH_SESSION_DAYS : 1;

  if (!email || !password.trim()) {
    return NextResponse.json({ error: "Введите email и пароль." }, { status: 400 });
  }

  const member = await prisma.brandMember.findUnique({
    where: { email },
    include: { brand: true },
  });

  const isPasswordValid = member ? await bcrypt.compare(password, member.passwordHash) : false;
  if (!member || !isPasswordValid) {
    return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 });
  }

  const response = NextResponse.json({ brand: member.brand, member: toPublicBrandMember(member) });
  response.cookies.set(
    BRAND_AUTH_COOKIE_NAME,
    await createBrandSessionToken({ brandMemberId: member.id, brandId: member.brandId }, sessionDays),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: sessionDays * 24 * 60 * 60,
    },
  );

  return response;
}
