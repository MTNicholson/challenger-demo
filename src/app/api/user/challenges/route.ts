import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { serializeUserChallenge } from "@/lib/public-challenges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const challenges = await prisma.userChallenge.findMany({
    where: { userId: user.id },
    orderBy: { activatedAt: "desc" },
    include: { reward: { select: { status: true } }, challenge: { include: { brand: true } } },
  });
  return NextResponse.json({ challenges: challenges.map((participation, index) => ({ ...participation, challenge: serializeUserChallenge(participation.challenge, index) })) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { challengeId?: string; progressTotal?: number } | null;
  if (!body?.challengeId) return NextResponse.json({ error: "Не указан челлендж" }, { status: 400 });
  const challenge = await prisma.brandChallenge.findFirst({ where: { id: body.challengeId, status: "active", brand: { status: "approved", publicStatus: "ONLINE", archivedAt: null } } });
  if (!challenge) return NextResponse.json({ error: "Челлендж недоступен" }, { status: 404 });
  const existing = await prisma.userChallenge.findUnique({ where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } } });
  const participation = existing ?? await prisma.userChallenge.upsert({ where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } }, update: {}, create: { userId: user.id, challengeId: challenge.id, progressTotal: Math.max(1, body.progressTotal ?? 1) } });
  if (!existing) await prisma.userChallengeEvent.create({ data: { userId: user.id, challengeId: challenge.id, participationId: participation.id, type: "challenge_activated", metadata: { source: "user" } } }).catch(() => undefined);
  return NextResponse.json({ participation, already: Boolean(existing) }, { status: existing ? 200 : 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { challengeId?: string } | null;
  if (!body?.challengeId) return NextResponse.json({ error: "Не указан челлендж" }, { status: 400 });

  const participation = await prisma.userChallenge.findUnique({
    where: { userId_challengeId: { userId: user.id, challengeId: body.challengeId } },
    include: { reward: true },
  });
  if (!participation) return NextResponse.json({ cancelled: true, already: true });
  if (participation.status !== "active" || participation.reward) {
    return NextResponse.json({ error: "Завершённый челлендж нельзя отменить." }, { status: 409 });
  }

  await prisma.userChallenge.delete({ where: { id: participation.id } });
  return NextResponse.json({ cancelled: true });
}
