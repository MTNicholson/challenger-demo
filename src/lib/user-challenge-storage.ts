"use client";

import { useEffect, useMemo, useState } from "react";
import { addFavoriteItem, removeFavoriteItem } from "@/lib/favorite-storage";
import type { Challenge } from "@/data/challenges";

export type UserChallengeState = {
  challengeId: string;
  isActive: boolean;
  progressCurrent: number;
  progressTotal: number;
  activatedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  isFavorite?: boolean;
  favoriteAddedAt?: string;
  rewardUsed?: boolean;
  rewardStatus?: "available" | "used";
  status?: "active" | "completed";
  challenge?: Challenge;
};

type UserChallengeDatabase = Record<string, UserChallengeState[]>;

const STORAGE_KEY = "challenger_user_challenges";
const CHANGE_EVENT = "challenger-user-challenges-change";

function readDatabase(): UserChallengeDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserChallengeDatabase) : {};
  } catch {
    return {};
  }
}

function writeDatabase(database: UserChallengeDatabase) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getInitialStates(userId: string): UserChallengeState[] {
  return userId === "alex"
    ? [
        {
          challengeId: "coffee-route",
          isActive: true,
          progressCurrent: 3,
          progressTotal: 5,
          activatedAt: new Date().toISOString(),
          isFavorite: true,
          favoriteAddedAt: new Date().toISOString(),
        },
      ]
    : [];
}

function ensureUserStates(userId: string) {
  const database = readDatabase();
  if (Object.prototype.hasOwnProperty.call(database, userId)) return database;

  database[userId] = getInitialStates(userId);
  writeDatabase(database);
  return database;
}

function updateChallengeState(
  userId: string,
  challengeId: string,
  update: (current: UserChallengeState) => UserChallengeState,
) {
  const database = ensureUserStates(userId);
  const states = database[userId] ?? [];
  const index = states.findIndex((state) => state.challengeId === challengeId);
  const current =
    index >= 0
      ? states[index]
      : { challengeId, isActive: false, progressCurrent: 0, progressTotal: 1 };
  const nextState = update(current);
  database[userId] =
    index >= 0
      ? states.map((state, stateIndex) => (stateIndex === index ? nextState : state))
      : [...states, nextState];
  writeDatabase(database);
  return nextState;
}

export function getCurrentUserId() {
  return null;
}

export function getUserChallengeStates(userId: string) {
  return ensureUserStates(userId)[userId] ?? [];
}

export function getUserChallengeState(userId: string, challengeId: string) {
  return getUserChallengeStates(userId).find((state) => state.challengeId === challengeId);
}

export function isChallengeActive(userId: string, challengeId: string) {
  return getUserChallengeState(userId, challengeId)?.isActive ?? false;
}

export async function activateChallenge(userId: string, challengeId: string, progressTotal = 1) {
  const response = await fetch("/api/user/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, progressTotal }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Не удалось принять челлендж.");
  const result = updateChallengeState(userId, challengeId, (current) => ({
    ...current,
    challengeId,
    isActive: true,
    progressCurrent: current.progressCurrent ?? 0,
    progressTotal: current.progressTotal > 1 ? current.progressTotal : progressTotal,
    activatedAt: new Date().toISOString(),
    cancelledAt: undefined,
  }));
  return result;
}

export async function cancelChallenge(userId: string, challengeId: string) {
  const response = await fetch("/api/user/challenges", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Не удалось отменить челлендж.");
  return updateChallengeState(userId, challengeId, (current) => ({
    ...current,
    isActive: false,
    cancelledAt: new Date().toISOString(),
  }));
}

export function toggleFavoriteChallenge(userId: string, challengeId: string) {
  return updateChallengeState(userId, challengeId, (current) => {
    if (current.isFavorite) {
      removeFavoriteItem(userId, "challenge", challengeId);
      return {
        ...current,
        isFavorite: false,
        favoriteAddedAt: undefined,
      };
    }

    const favoriteAddedAt = new Date().toISOString();
    addFavoriteItem(userId, "challenge", challengeId, favoriteAddedAt);
    return {
      ...current,
      isFavorite: true,
      favoriteAddedAt,
    };
  });
}

export function getActiveChallengesForUser(userId: string) {
  return getUserChallengeStates(userId).filter((state) => state.isActive);
}

export function useUserChallengeStates(userId?: string | null) {
  const [ready, setReady] = useState(false);
  const [states, setStates] = useState<UserChallengeState[]>([]);

  useEffect(() => {
    const sync = async () => {
      setStates(userId ? getUserChallengeStates(userId) : []);
      if (userId) { const response = await fetch("/api/user/challenges", { credentials: "include", cache: "no-store" }).catch(() => null); const data = response?.ok ? await response.json().catch(() => null) : null; if (data?.challenges) { const database = readDatabase(); const local = database[userId] ?? []; database[userId] = data.challenges.map((item: UserChallengeState & { activatedAt: string; completedAt?: string; status: "active" | "completed"; progressCurrent: number; progressTotal: number; reward?: { status: "available" | "used" } | null; challenge?: Challenge }) => ({ ...local.find((state) => state.challengeId === item.challengeId), challengeId: item.challengeId, isActive: item.status === "active" || item.status === "completed", progressCurrent: item.progressCurrent, progressTotal: item.progressTotal, activatedAt: item.activatedAt, completedAt: item.completedAt, status: item.status, rewardStatus: item.reward?.status, rewardUsed: item.reward?.status === "used", challenge: item.challenge })); localStorage.setItem(STORAGE_KEY, JSON.stringify(database)); setStates(database[userId]); } }
      setReady(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, [userId]);

  return useMemo(() => ({ ready, states }), [ready, states]);
}
