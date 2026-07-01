import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_SESSION_DAYS, splitIdentifier, toPublicUser } from "@/lib/auth-shared";
import { createSessionToken } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { login?: string; identifier?: string; password?: string; rememberMe?: boolean }
    | null;

  const identifier = splitIdentifier(body?.identifier ?? body?.login ?? "");
  const password = body?.password ?? "";
  const sessionDays = body?.rememberMe === true ? AUTH_SESSION_DAYS : 1;

  if (!identifier || !password.trim()) {
    return NextResponse.json({ error: "Введите email/телефон и пароль." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        identifier.email ? { email: identifier.email } : undefined,
        identifier.phone ? { phone: identifier.phone } : undefined,
      ].filter(Boolean) as Array<{ email: string } | { phone: string }>,
    },
  });

  const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !isPasswordValid) {
    return NextResponse.json({ error: "Неверный пароль или пользователь не найден." }, { status: 401 });
  }

  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(AUTH_COOKIE_NAME, await createSessionToken({ userId: user.id }, sessionDays), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: sessionDays * 24 * 60 * 60,
  });

  return response;
}
