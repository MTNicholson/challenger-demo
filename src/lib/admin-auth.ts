import "server-only";

import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE_NAME = "challenger_admin_session";
const SESSION_DAYS = 1;
const attempts = new Map<string, { count: number; resetAt: number }>();

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  return new TextEncoder().encode(value);
}

export function adminConfigured() { return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET); }
export function adminEmail() { return process.env.ADMIN_EMAIL?.trim().toLocaleLowerCase() ?? ""; }
export function loginAllowed(key: string) {
  const now = Date.now(); const item = attempts.get(key);
  if (!item || item.resetAt < now) { attempts.set(key, { count: 1, resetAt: now + 15 * 60_000 }); return true; }
  if (item.count >= 8) return false; item.count += 1; return true;
}
export function resetLoginAttempts(key: string) { attempts.delete(key); }
export async function checkAdminCredentials(email: string, password: string) {
  if (!adminConfigured() || email.trim().toLocaleLowerCase() !== adminEmail()) return false;
  return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
}
export async function createAdminSession() {
  return new SignJWT({ email: adminEmail(), role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${SESSION_DAYS}d`).sign(secret());
}
export async function getCurrentAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret()); return payload.role === "admin" && payload.email === adminEmail() ? { email: adminEmail() } : null; } catch { return null; }
}
export async function requireAdmin() { const admin = await getCurrentAdmin(); if (!admin) throw new Error("ADMIN_UNAUTHORIZED"); return admin; }
export async function audit(data: { adminEmail: string; actionType: string; entityType: string; entityId?: string; before?: unknown; after?: unknown; metadata?: unknown; comment?: string; brandId?: string }) {
  return prisma.adminAction.create({ data: { ...data, before: data.before as never, after: data.after as never, metadata: data.metadata as never } });
}
