import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { getImageFile, saveBrandImage, validateBrandImage } from "@/lib/brand-upload-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData ? getImageFile(formData, "heroImage") : null;
  if (!file) return NextResponse.json({ error: "Выберите изображение для челленджа." }, { status: 400 });

  const validationError = validateBrandImage(file, "Промо-изображение");
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const url = await saveBrandImage(file, "challenge-hero");
  if (!url) return NextResponse.json({ error: "Не удалось сохранить изображение." }, { status: 500 });

  return NextResponse.json({ url, filename: file.name });
}
