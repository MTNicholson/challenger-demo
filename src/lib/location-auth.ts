import "server-only";

import { NextResponse } from "next/server";
import { getCurrentLocationSession } from "@/lib/auth-server";

export async function requireLocationSession() {
  return getCurrentLocationSession();
}

export function locationUnauthorized() {
  return NextResponse.json({ error: "Требуется вход в кабинет точки." }, { status: 401 });
}

export function requireLocationAdmin(session: Awaited<ReturnType<typeof getCurrentLocationSession>>) {
  return session?.user.role === "LOCATION_ADMIN";
}

export function canManageLocationCampaigns(session: Awaited<ReturnType<typeof getCurrentLocationSession>>) {
  return Boolean(session && requireLocationAdmin(session) && session.location.mode !== "STANDARD");
}
