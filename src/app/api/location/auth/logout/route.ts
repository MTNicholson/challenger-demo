import { NextResponse } from "next/server";
import { LOCATION_AUTH_COOKIE_NAME } from "@/lib/auth-shared";
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.set(LOCATION_AUTH_COOKIE_NAME, "", { httpOnly: true, path: "/", expires: new Date(0) }); return response; }
