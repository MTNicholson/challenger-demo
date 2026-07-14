import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AUTH_SESSION_DAYS, LOCATION_AUTH_COOKIE_NAME, normalizeIdentifier } from "@/lib/auth-shared";
import { createLocationSessionToken } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string; rememberMe?: boolean } | null;
  const email = normalizeIdentifier(body?.email ?? "");
  const password = body?.password ?? "";
  if (!email || !password.trim()) return NextResponse.json({ error: "Введите логин и пароль." }, { status: 400 });

  const user = await prisma.locationUser.findUnique({ where: { email }, include: { location: true, brand: true } });
  const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !isPasswordValid) return NextResponse.json({ error: "Неверный логин или пароль." }, { status: 401 });
  if (user.status !== "ACTIVE" || !user.location.cabinetEnabled || user.brand.status !== "approved") return NextResponse.json({ error: "Вход в кабинет точки сейчас недоступен. Обратитесь к администратору бренда." }, { status: 403 });

  const sessionDays = body?.rememberMe ? AUTH_SESSION_DAYS : 1;
  await prisma.locationUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const response = NextResponse.json({ user: { id: user.id, name: user.name, role: user.role }, redirectTo: user.role === "LOCATION_ADMIN" ? "/location" : "/location/scanner" });
  response.cookies.set(LOCATION_AUTH_COOKIE_NAME, await createLocationSessionToken({ locationUserId: user.id, locationId: user.locationId, brandId: user.brandId }, sessionDays), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: sessionDays * 24 * 60 * 60 });
  return response;
}
