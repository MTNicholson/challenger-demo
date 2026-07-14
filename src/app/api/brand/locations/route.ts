import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
import { normalizeIdentifier } from "@/lib/auth-shared";

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
    include: { users: { where: { role: "LOCATION_ADMIN", status: "ACTIVE" }, select: { id: true, name: true, email: true, status: true } }, _count: { select: { users: { where: { status: "ACTIVE" } } } } },
  });

  return NextResponse.json({ locations: locations.map((location) => ({ ...location, locationAdmin: location.users[0] ?? null, staffCount: location._count.users })) });
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
  const mode = body?.mode === "EXTENDED" || body?.mode === "FLAGSHIP" ? body.mode : "STANDARD";
  const adminName = getStringField(body, "locationAdminName");
  const adminEmail = normalizeIdentifier(getStringField(body, "locationAdminEmail"));
  const adminPassword = getStringField(body, "locationAdminPassword");
  const adminPasswordConfirmation = getStringField(body, "locationAdminPasswordConfirmation");

  if (!city || !address) {
    return NextResponse.json({ error: "Заполните город и адрес точки." }, { status: 400 });
  }

  if (!adminName || !adminEmail || !adminEmail.includes("@") || adminPassword.length < 6 || adminPassword !== adminPasswordConfirmation) {
    return NextResponse.json({ error: "Для новой точки заполните данные администратора и подтвердите пароль не короче 6 символов." }, { status: 400 });
  }

  if (await prisma.locationUser.findUnique({ where: { email: adminEmail }, select: { id: true } })) return NextResponse.json({ error: "Этот email уже используется для кабинета точки." }, { status: 409 });

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

    const location = await tx.brandLocation.create({
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
        mode,
        cabinetEnabled: true,
      },
    });
    await tx.locationUser.create({ data: { brandId: session.brand.id, locationId: location.id, name: adminName, email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: "LOCATION_ADMIN" } });
    return location;
  });

  return NextResponse.json({ location }, { status: 201 });
}
