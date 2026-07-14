import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { normalizeIdentifier } from "@/lib/auth-shared";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: RouteContext<"/api/brand/locations/[id]/users/[userId]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });
  const { id: locationId, userId } = await context.params;
  const user = await prisma.locationUser.findFirst({ where: { id: userId, locationId, brandId: session.brand.id } });
  if (!user) return NextResponse.json({ error: "Пользователь точки не найден." }, { status: 404 });
  const body = (await request.json().catch(() => null)) as { name?: string; email?: string; status?: "ACTIVE" | "DISABLED"; password?: string; passwordConfirmation?: string } | null;
  const name = body?.name?.trim();
  const email = body?.email === undefined ? undefined : normalizeIdentifier(body.email);
  if (email !== undefined && (!email.includes("@") || !email)) return NextResponse.json({ error: "Введите корректный email." }, { status: 400 });
  if (email && email !== user.email) {
    const existing = await prisma.locationUser.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Этот email уже используется." }, { status: 409 });
  }
  if (body?.password && (body.password.length < 6 || body.password !== body.passwordConfirmation)) return NextResponse.json({ error: "Пароли не совпадают или слишком короткие." }, { status: 400 });
  const updated = await prisma.locationUser.update({ where: { id: user.id }, data: { ...(name ? { name } : {}), ...(email ? { email } : {}), ...(body?.status ? { status: body.status } : {}), ...(body?.password ? { passwordHash: await bcrypt.hash(body.password, 12) } : {}) }, select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true } });
  return NextResponse.json({ user: updated });
}
