import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { getOptionalStringField, getStringField, validateBrandCategory, validateRussianCity } from "@/lib/brand-settings-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = getStringField(body, "name");
  const category = getStringField(body, "category");
  const city = getStringField(body, "city");
  const address = getStringField(body, "address");
  const description = getOptionalStringField(body, "description");
  const website = getOptionalStringField(body, "website");

  if (!name || !category || !city || !address) {
    return NextResponse.json({ error: "Заполните название, категорию, город и адрес." }, { status: 400 });
  }

  if (!validateBrandCategory(category)) {
    return NextResponse.json({ error: "Выберите категорию из списка." }, { status: 400 });
  }

  if (!validateRussianCity(city)) {
    return NextResponse.json({ error: "Выберите город из списка." }, { status: 400 });
  }

  const brand = await prisma.$transaction(async (tx) => {
    const updatedBrand = await tx.brand.update({
      where: { id: session.brand.id },
      data: { name, category, city, address, description, website },
    });

    await tx.brandLocation.updateMany({
      where: { brandId: session.brand.id, isMain: true },
      data: { city, address },
    });

    return updatedBrand;
  });

  return NextResponse.json({ brand });
}
