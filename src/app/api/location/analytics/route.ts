import { NextResponse } from "next/server";
import { requireLocationAdmin, requireLocationSession, locationUnauthorized } from "@/lib/location-auth";
import { prisma } from "@/lib/prisma";
export async function GET() { const session = await requireLocationSession(); if (!session) return locationUnauthorized(); if (!requireLocationAdmin(session)) return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 }); const challenges = await prisma.brandChallenge.count({ where: { brandId: session.brand.id, locationIds: { has: session.location.id } } }); return NextResponse.json({ challenges, participants: 0, completions: 0, rewardActivations: 0 }); }
