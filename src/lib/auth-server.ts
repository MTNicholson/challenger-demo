import "server-only";

import { cache } from "react";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_DAYS,
  BRAND_AUTH_COOKIE_NAME,
  toPublicBrandMember,
  toPublicUser,
  type PublicBrand,
  type PublicBrandMember,
  type PublicUser,
} from "@/lib/auth-shared";
import { prisma } from "@/lib/prisma";

type SessionPayload = {
  userId: string;
};

type BrandSessionPayload = {
  brandMemberId: string;
  brandId: string;
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

export async function createBrandSessionToken(payload: BrandSessionPayload, sessionDays = AUTH_SESSION_DAYS) {
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

export async function verifyBrandSessionToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const brandMemberId = typeof payload.brandMemberId === "string" ? payload.brandMemberId : null;
    const brandId = typeof payload.brandId === "string" ? payload.brandId : null;
    return brandMemberId && brandId ? { brandMemberId, brandId } : null;
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

export const getCurrentBrandSession = cache(async () => {
  const cookieStore = await cookies();
  return verifyBrandSessionToken(cookieStore.get(BRAND_AUTH_COOKIE_NAME)?.value);
});

export const getCurrentBrand = cache(async (): Promise<{ member: PublicBrandMember; brand: PublicBrand } | null> => {
  const session = await getCurrentBrandSession();
  if (!session) return null;

  const member = await prisma.brandMember.findUnique({
    where: { id: session.brandMemberId },
    include: { brand: true },
  });

  if (!member || member.brandId !== session.brandId) return null;

  return {
    member: toPublicBrandMember(member),
    brand: member.brand,
  };
});
