import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_SESSION_DAYS, splitIdentifier, toPublicUser } from "@/lib/auth-shared";
import { createSessionToken } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { name?: string; login?: string; identifier?: string; password?: string; city?: string }
    | null;

  const name = body?.name?.trim() ?? "";
  const password = body?.password ?? "";
  const identifier = splitIdentifier(body?.identifier ?? body?.login ?? "");
  const city = body?.city?.trim() || "Санкт-Петербург";

  if (!name || !identifier || !password.trim()) {
    return NextResponse.json({ error: "Заполните все поля." }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        identifier.email ? { email: identifier.email } : undefined,
        identifier.phone ? { phone: identifier.phone } : undefined,
      ].filter(Boolean) as Array<{ email: string } | { phone: string }>,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Пользователь уже существует. Попробуйте войти." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: identifier.email,
      phone: identifier.phone,
      passwordHash,
      name,
      city,
    },
  });

  const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  response.cookies.set(AUTH_COOKIE_NAME, await createSessionToken({ userId: user.id }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: AUTH_SESSION_DAYS * 24 * 60 * 60,
  });

  return response;
}
