import { NextResponse } from "next/server";
import { requireLocationSession, locationUnauthorized } from "@/lib/location-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  const scans = await prisma.rewardScanLog.findMany({
    where: { locationId: session.location.id, brandId: session.brand.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const users = scans.length ? await prisma.user.findMany({ where: { id: { in: scans.flatMap((scan) => scan.userId ? [scan.userId] : []) } }, select: { id: true, name: true } }) : [];
  const staff = scans.length ? await prisma.locationUser.findMany({ where: { id: { in: scans.map((scan) => scan.locationUserId) } }, select: { id: true, name: true } }) : [];
  const challenges = scans.length ? await prisma.brandChallenge.findMany({ where: { id: { in: scans.flatMap((scan) => scan.challengeId ? [scan.challengeId] : []) } }, select: { id: true, title: true } }) : [];
  const tokens = scans.length ? await prisma.rewardToken.findMany({ where: { id: { in: scans.flatMap((scan) => scan.rewardTokenId ? [scan.rewardTokenId] : []) } }, include: { participation: { include: { reward: true } }, challenge: { select: { reward: true } } } }) : [];
  return NextResponse.json({ scans: scans.map((scan) => { const token = tokens.find((item) => item.id === scan.rewardTokenId); return { id: scan.id, createdAt: scan.createdAt.toISOString(), status: scan.status, rewardTitle: token?.participation.reward?.title ?? token?.challenge.reward ?? "Награда", challengeTitle: challenges.find((item) => item.id === scan.challengeId)?.title ?? "—", userName: users.find((item) => item.id === scan.userId)?.name ?? "—", staffName: staff.find((item) => item.id === scan.locationUserId)?.name ?? "—", shortCode: scan.codeRaw ?? token?.shortCode ?? "—", message: scan.message ?? "" }; }) });
}
