import { NextResponse } from "next/server";
import { requireLocationSession, locationUnauthorized } from "@/lib/location-auth";
export async function GET() { const session = await requireLocationSession(); if (!session) return locationUnauthorized(); return NextResponse.json({ scans: [] }); }
