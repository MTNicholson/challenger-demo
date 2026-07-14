import { NextResponse } from "next/server";
import { getCurrentLocationSession } from "@/lib/auth-server";
export async function GET() { const session = await getCurrentLocationSession(); if (!session) return NextResponse.json({ user: null }, { status: 401 }); return NextResponse.json({ user: { id: session.user.id, name: session.user.name, role: session.user.role, locationId: session.location.id, brandId: session.brand.id }, location: { name: session.location.name, address: session.location.fullAddress ?? session.location.address }, brand: { name: session.brand.name } }); }
