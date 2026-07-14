import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });
  const body = await request.json().catch(() => null) as { publicStatus?: unknown } | null;
  const publicStatus = body?.publicStatus;
  if (publicStatus !== "ONLINE" && publicStatus !== "OFFLINE") return NextResponse.json({ error: "Некорректный публичный статус." }, { status: 400 });
  if (publicStatus === "ONLINE" && session.brand.status !== "approved") return NextResponse.json({ error: "Публичный запуск будет доступен после подтверждения бренда администратором платформы." }, { status: 403 });
  const brand = await prisma.brand.update({ where: { id: session.brand.id }, data: { publicStatus } });
  return NextResponse.json({ brand: { id: brand.id, status: brand.status, publicStatus: brand.publicStatus } });
}
