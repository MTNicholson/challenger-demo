import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { normalizeIdentifier } from "@/lib/auth-shared";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RequestBody = { email?: string; brandName?: string; password?: string; action?: "verify" | "reset" };

async function findMember(email: string, brandName: string) {
  const member = await prisma.brandMember.findUnique({ where: { email }, include: { brand: true } });
  return member && member.brand.name.trim().toLocaleLowerCase() === brandName.trim().toLocaleLowerCase() ? member : null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as RequestBody | null;
  const email = normalizeIdentifier(body?.email ?? "");
  const brandName = body?.brandName?.trim() ?? "";
  if (!email || !brandName) return NextResponse.json({ error: "Введите email и название бренда." }, { status: 400 });

  const member = await findMember(email, brandName);
  if (!member) return NextResponse.json({ error: "Не удалось подтвердить данные бренда." }, { status: 404 });
  if (body?.action === "verify") return NextResponse.json({ verified: true });

  const password = body?.password ?? "";
  if (!password.trim()) return NextResponse.json({ error: "Введите новый пароль." }, { status: 400 });
  await prisma.brandMember.update({ where: { id: member.id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  return NextResponse.json({ updated: true });
}
