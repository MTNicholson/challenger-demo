import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audit, getCurrentAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
async function auth() { const admin = await getCurrentAdmin(); return admin ? admin : null; }
function serialize<T extends Record<string, unknown>>(value: T) { const result = { ...value } as Record<string, unknown>; for (const key of ["createdAt", "updatedAt", "activatedAt", "completedAt", "approvedAt", "archivedAt"]) { if (result[key] instanceof Date) result[key] = (result[key] as Date).toISOString(); } return result; }

export async function GET(request: Request, context: RouteContext<"/api/admin/[...path]">) {
  const admin = await auth(); if (!admin) return jsonError("Требуется вход администратора.", 401);
  const path = (await context.params).path;
  const search = new URL(request.url).searchParams;
  if (path[0] === "me") return NextResponse.json({ admin });
  if (path[0] === "dashboard") {
    const [brands, pending, challenges, users, locations, recentBrands, recentChallenges, auditLog] = await Promise.all([
      prisma.brand.count({ where: { archivedAt: null } }), prisma.brand.count({ where: { status: "pending", archivedAt: null } }), prisma.brandChallenge.count({ where: { status: "active" } }), prisma.user.count(), prisma.brandLocation.count(), prisma.brand.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { members: { take: 1 } } }), prisma.brandChallenge.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { brand: true } }), prisma.adminAction.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    ]);
    return NextResponse.json({ metrics: { brands, pending, challenges, users, locations }, recentBrands: recentBrands.map(serialize), recentChallenges: recentChallenges.map((item) => ({ ...serialize(item), brandName: item.brand.name })), audit: auditLog.map(serialize) });
  }
  if (path[0] === "brands") {
    const id = path[1];
    if (id) { const brand = await prisma.brand.findUnique({ where: { id }, include: { members: true, locations: true, challenges: { orderBy: { createdAt: "desc" } }, _count: { select: { challenges: true, locations: true } } } }); return brand ? NextResponse.json({ brand: serialize(brand) }) : jsonError("Бренд не найден.", 404); }
    const status = search.get("status"); const q = search.get("q") ?? "";
    const brands = await prisma.brand.findMany({ where: { ...(status && status !== "all" ? { status } : {}), ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) }, orderBy: { createdAt: "desc" }, include: { members: { take: 1 }, _count: { select: { challenges: true, locations: true } } } });
    return NextResponse.json({ brands: brands.map(serialize) });
  }
  if (path[0] === "challenges") {
    const id = path[1];
    if (id) { const challenge = await prisma.brandChallenge.findUnique({ where: { id }, include: { brand: true, _count: { select: { participations: true } } } }); return challenge ? NextResponse.json({ challenge: serialize(challenge) }) : jsonError("Челлендж не найден.", 404); }
    const challenges = await prisma.brandChallenge.findMany({ where: search.get("q") ? { title: { contains: search.get("q")!, mode: "insensitive" } } : undefined, orderBy: { createdAt: "desc" }, include: { brand: true, _count: { select: { participations: true } } } });
    return NextResponse.json({ challenges: challenges.map((item) => ({ ...serialize(item), brandName: item.brand.name, participants: item._count.participations })) });
  }
  if (path[0] === "users") {
    const id = path[1];
    if (id) { const user = await prisma.user.findUnique({ where: { id }, include: { challenges: { include: { challenge: { include: { brand: true } }, reward: true }, orderBy: { activatedAt: "desc" } }, rewards: true, walletTransactions: { orderBy: { createdAt: "desc" }, take: 10 } } }); return user ? NextResponse.json({ user: { ...serialize(user), passwordHash: undefined } }) : jsonError("Пользователь не найден.", 404); }
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { challenges: true, rewards: true } } } });
    return NextResponse.json({ users: users.map((user) => ({ ...serialize(user), passwordHash: undefined })) });
  }
  if (path[0] === "locations") { const locations = await prisma.brandLocation.findMany({ orderBy: { createdAt: "desc" }, include: { brand: true } }); return NextResponse.json({ locations: locations.map((item) => ({ ...serialize(item), brandName: item.brand.name })) }); }
  if (path[0] === "audit") { const rows = await prisma.adminAction.findMany({ take: 200, orderBy: { createdAt: "desc" } }); return NextResponse.json({ audit: rows.map(serialize) }); }
  return jsonError("Раздел не найден.", 404);
}

export async function POST(request: Request, context: RouteContext<"/api/admin/[...path]">) {
  const admin = await auth(); if (!admin) return jsonError("Требуется вход администратора.", 401);
  const path = (await context.params).path; const body = (await request.json().catch(() => ({}))) as { comment?: string; reason?: string; confirmWord?: string };
  const id = path[1];
  if (path[0] === "brands" && id && ["approve", "reject", "block", "unblock"].includes(path[2] ?? "")) {
    const brand = await prisma.brand.findUnique({ where: { id } }); if (!brand) return jsonError("Бренд не найден.", 404);
    const status = path[2] === "approve" || path[2] === "unblock" ? "approved" : path[2] === "reject" ? "rejected" : "blocked";
    const updated = await prisma.brand.update({ where: { id }, data: { status, approvedAt: status === "approved" ? new Date() : brand.approvedAt, approvedBy: status === "approved" ? admin.email : brand.approvedBy, rejectionReason: status === "rejected" ? (body.reason?.trim() || null) : brand.rejectionReason } });
    await audit({ adminEmail: admin.email, actionType: `${path[2]}_brand`, entityType: "brand", entityId: id, brandId: id, before: { status: brand.status }, after: { status: updated.status }, comment: body.comment ?? body.reason });
    return NextResponse.json({ brand: serialize(updated) });
  }
  if (path[0] === "challenges" && id && path[2] === "archive") {
    const challenge = await prisma.brandChallenge.findUnique({ where: { id } }); if (!challenge) return jsonError("Челлендж не найден.", 404);
    const updated = await prisma.brandChallenge.update({ where: { id }, data: { status: "archived" } }); await audit({ adminEmail: admin.email, actionType: "archive_challenge", entityType: "challenge", entityId: id, before: { status: challenge.status }, after: { status: "archived" }, comment: body.comment }); return NextResponse.json({ challenge: serialize(updated) });
  }
  if (path[0] === "challenges" && id && path[2] === "delete") {
    if (body.confirmWord !== "УДАЛИТЬ") return jsonError("Для удаления введите слово «УДАЛИТЬ».", 400);
    const challenge = await prisma.brandChallenge.findUnique({ where: { id }, select: { id: true, title: true, status: true, brandId: true } });
    if (!challenge) return jsonError("Челлендж не найден.", 404);
    await prisma.$transaction(async (tx) => {
      await tx.brandChallenge.delete({ where: { id } });
      await tx.locationChallengeRequest.updateMany({ where: { sourceChallengeId: id }, data: { sourceChallengeId: null } });
    });
    await audit({ adminEmail: admin.email, actionType: "delete_challenge_permanently", entityType: "challenge", entityId: id, brandId: challenge.brandId, before: { title: challenge.title, status: challenge.status }, comment: body.comment });
    return NextResponse.json({ deleted: true });
  }
  if (path[0] === "users" && id && path[2] === "challenges" && path[4] === "complete") {
    const challengeId = path[3]; if (!challengeId) return jsonError("Не указан челлендж.");
    const result = await prisma.$transaction(async (tx) => {
      const participation = await tx.userChallenge.findUnique({ where: { userId_challengeId: { userId: id, challengeId } }, include: { challenge: true, reward: true } });
      if (!participation) throw new Error("PARTICIPATION_NOT_FOUND");
      if (participation.status === "completed") return { participation, already: true };
      const qrToken = participation.qrToken ?? crypto.randomUUID();
      const points = Number((participation.challenge.rewardData as { points?: number } | null)?.points ?? 0);
      const updated = await tx.userChallenge.update({ where: { id: participation.id }, data: { status: "completed", completedAt: new Date(), completionSource: "admin", rewardIssuedAt: new Date(), qrToken, progressCurrent: participation.progressTotal } });
      await tx.userChallengeEvent.create({ data: { userId: id, challengeId, participationId: participation.id, type: "admin_challenge_completed", metadata: { adminEmail: admin.email, comment: body.comment ?? null } } });
      if (!participation.reward) await tx.userReward.create({ data: { userId: id, participationId: participation.id, title: participation.challenge.reward ?? "Награда от бренда", description: participation.challenge.description, qrToken } });
      if (points > 0) { await tx.walletTransaction.create({ data: { userId: id, amount: points, type: "challenge_completion", metadata: { challengeId, source: "admin" } } }); await tx.user.update({ where: { id }, data: { coinsBalance: { increment: points } } }); }
      return { participation: updated, already: false };
    }).catch((error: unknown) => { if (error instanceof Error && error.message === "PARTICIPATION_NOT_FOUND") return null; throw error; });
    if (!result) return jsonError("У пользователя нет участия в этом челлендже.", 404); if (result.already) return jsonError("Челлендж уже завершён.", 409);
    await audit({ adminEmail: admin.email, actionType: "complete_user_challenge_manually", entityType: "user_challenge", entityId: result.participation.id, metadata: { userId: id, challengeId }, comment: body.comment });
    return NextResponse.json({ participation: serialize(result.participation) });
  }
  return jsonError("Действие не найдено.", 404);
}
