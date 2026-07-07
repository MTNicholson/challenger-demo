import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { getImageFile, saveBrandImage, validateBrandImage } from "@/lib/brand-upload-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Некорректные данные формы." }, { status: 400 });

  const logoFile = getImageFile(formData, "logo");
  const coverImageFile = getImageFile(formData, "coverImage") ?? getImageFile(formData, "cover");
  if (!logoFile && !coverImageFile) {
    return NextResponse.json({ error: "Выберите логотип или промо-картинку." }, { status: 400 });
  }

  const logoError = logoFile ? validateBrandImage(logoFile, "Логотип") : null;
  const coverError = coverImageFile ? validateBrandImage(coverImageFile, "Промо-картинка") : null;
  if (logoError || coverError) {
    return NextResponse.json({ error: logoError ?? coverError }, { status: 400 });
  }

  const logoUrl = logoFile ? await saveBrandImage(logoFile, "logo") : undefined;
  const coverImageUrl = coverImageFile ? await saveBrandImage(coverImageFile, "cover") : undefined;
  const brand = await prisma.brand.update({
    where: { id: session.brand.id },
    data: { logoUrl, coverImageUrl },
  });

  return NextResponse.json({ brand });
}
