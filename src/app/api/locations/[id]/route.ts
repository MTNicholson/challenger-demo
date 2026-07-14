import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext<"/api/locations/[id]">) {
  const { id } = await context.params;
  const location = await prisma.brandLocation.findFirst({
    where: { id, brand: { status: "approved", publicStatus: "ONLINE", archivedAt: null } },
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

  if (!location) {
    return NextResponse.json({ error: "Точка не найдена." }, { status: 404 });
  }

  return NextResponse.json({ location });
}
