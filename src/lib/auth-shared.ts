import type { User } from "@prisma/client";

export const AUTH_COOKIE_NAME = "challenger_session";
export const AUTH_SESSION_DAYS = 7;

export type PublicUser = Omit<User, "passwordHash">;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    city: user.city,
    avatarUrl: user.avatarUrl,
    coinsBalance: user.coinsBalance,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function normalizeIdentifier(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function splitIdentifier(identifierInput: string) {
  const identifier = normalizeIdentifier(identifierInput);
  if (!identifier) return null;

  if (identifier.includes("@")) {
    return { email: identifier, phone: null };
  }

  const phone = identifier.replace(/[^\d+]/g, "");
  return phone ? { email: null, phone } : null;
}
