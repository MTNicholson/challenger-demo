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

export async function GET() {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const locations = await prisma.brandLocation.findMany({
    where: { brandId: session.brand.id },
    orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ locations });
}

export async function POST(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

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
        where: { brandId: session.brand.id },
        data: { isMain: false },
      });
    }

    return tx.brandLocation.create({
      data: {
        brandId: session.brand.id,
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

  return NextResponse.json({ location }, { status: 201 });
}
