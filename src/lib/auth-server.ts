import "server-only";

import { cache } from "react";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AUTH_SESSION_DAYS, toPublicUser, type PublicUser } from "@/lib/auth-shared";
import { prisma } from "@/lib/prisma";

type SessionPayload = {
  userId: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET должен быть задан и содержать минимум 32 символа.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload, sessionDays = AUTH_SESSION_DAYS) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDays * 24 * 60 * 60;

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const userId = typeof payload.userId === "string" ? payload.userId : null;
    return userId ? { userId } : null;
  } catch {
    return null;
  }
}

export const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return user ? toPublicUser(user) : null;
});
