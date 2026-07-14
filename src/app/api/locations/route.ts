import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await prisma.brandLocation.findMany({
    where: {
      lat: { not: null },
      lng: { not: null },
      brand: { status: "approved", publicStatus: "ONLINE", archivedAt: null },
    },
    orderBy: [{ isMain: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      city: true,
      address: true,
      fullAddress: true,
      lat: true,
      lng: true,
      description: true,
      isMain: true,
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          logoUrl: true,
          coverImageUrl: true,
        },
      },
    },
  });

  return NextResponse.json({ locations });
}
