import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import {
  getOptionalNumberField,
  getOptionalStringField,
  getStringField,
  isValidLatitude,
  isValidLongitude,
  validateRussianCity,
} from "@/lib/brand-settings-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBooleanField(source: Record<string, unknown> | null, key: string) {
  return source?.[key] === true;
}

async function getOwnedLocation(id: string, brandId: string) {
  return prisma.brandLocation.findFirst({ where: { id, brandId } });
}

export async function PATCH(request: Request, context: RouteContext<"/api/brand/locations/[id]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const { id } = await context.params;
  if (!(await getOwnedLocation(id, session.brand.id))) {
    return NextResponse.json({ error: "Точка не найдена." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = getOptionalStringField(body, "name");
  const city = getStringField(body, "city");
  const address = getStringField(body, "address");
  const fullAddress = getOptionalStringField(body, "fullAddress");
  const lat = getOptionalNumberField(body, "lat");
  const lng = getOptionalNumberField(body, "lng");
  const geoProvider = getOptionalStringField(body, "geoProvider");
  const geoPlaceId = getOptionalStringField(body, "geoPlaceId");
  const description = getOptionalStringField(body, "description");
  const requestedMain = getBooleanField(body, "isMain");

  if (!city || !address) {
    return NextResponse.json({ error: "Заполните город и адрес точки." }, { status: 400 });
  }

  if (!validateRussianCity(city)) {
    return NextResponse.json({ error: "Выберите город из списка." }, { status: 400 });
  }

  if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
    return NextResponse.json({ error: "Проверьте координаты точки." }, { status: 400 });
  }

  const location = await prisma.$transaction(async (tx) => {
    if (requestedMain) {
      await tx.brandLocation.updateMany({
        where: { brandId: session.brand.id, NOT: { id } },
        data: { isMain: false },
      });
    }

    return tx.brandLocation.update({
      where: { id },
      data: {
        name,
        city,
        address,
        fullAddress,
        lat,
        lng,
        geoProvider,
        geoPlaceId,
        description,
        isMain: requestedMain,
      },
    });
  });

  return NextResponse.json({ location });
}

export async function DELETE(_request: Request, context: RouteContext<"/api/brand/locations/[id]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const { id } = await context.params;
  const existing = await getOwnedLocation(id, session.brand.id);
  if (!existing) return NextResponse.json({ error: "Точка не найдена." }, { status: 404 });

  await prisma.brandLocation.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
