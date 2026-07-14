import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkAdminCredentials, createAdminSession, loginAllowed, resetLoginAttempts } from "@/lib/admin-auth";
import { audit } from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null; const email = body?.email?.trim().toLocaleLowerCase() ?? ""; const key = `${request.headers.get("x-forwarded-for") ?? "unknown"}:${email}`;
  if (!loginAllowed(key)) return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  const valid = await checkAdminCredentials(email, body?.password ?? "");
  if (!valid) { if (process.env.ADMIN_EMAIL) await audit({ adminEmail: email || "unknown", actionType: "login_failure", entityType: "admin", metadata: { ip: request.headers.get("x-forwarded-for") ?? null } }); return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 }); }
  resetLoginAttempts(key); await audit({ adminEmail: email, actionType: "login_success", entityType: "admin" }); const response = NextResponse.json({ admin: { email } }); response.cookies.set(ADMIN_COOKIE_NAME, await createAdminSession(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 86400 }); return response;
}
