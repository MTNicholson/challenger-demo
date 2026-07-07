import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { toPublicUser } from "@/lib/auth-shared";
import { prisma } from "@/lib/prisma";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Требуется вход пользователя." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { city?: string } | null;
  const city = body?.city?.trim() ?? "";

  if (!RUSSIAN_CITIES.includes(city as (typeof RUSSIAN_CITIES)[number])) {
    return NextResponse.json({ error: "Выберите город из списка." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { city },
  });

  return NextResponse.json({ user: toPublicUser(user) });
}
