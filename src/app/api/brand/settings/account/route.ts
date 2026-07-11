import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getCurrentBrandSession } from "@/lib/auth-server";
import { normalizeIdentifier } from "@/lib/auth-shared";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await getCurrentBrandSession();
  if (!session) return NextResponse.json({ error: "Требуется вход в кабинет бренда." }, { status: 401 });

  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = body?.email === undefined ? undefined : normalizeIdentifier(body.email);
  const password = body?.password;
  if (email !== undefined && !email) return NextResponse.json({ error: "Введите email." }, { status: 400 });
  if (password !== undefined && !password.trim()) return NextResponse.json({ error: "Введите новый пароль." }, { status: 400 });
  if (email === undefined && password === undefined) return NextResponse.json({ error: "Нет данных для обновления." }, { status: 400 });

  try {
    const member = await prisma.brandMember.update({
      where: { id: session.brandMemberId },
      data: { ...(email === undefined ? {} : { email }), ...(password === undefined ? {} : { passwordHash: await bcrypt.hash(password, 12) }) },
    });
    return NextResponse.json({ email: member.email });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить данные. Возможно, этот email уже используется." }, { status: 409 });
  }
}
