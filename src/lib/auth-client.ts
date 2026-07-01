"use client";

import { useEffect, useState } from "react";
import type { PublicUser } from "@/lib/auth-shared";

type CurrentUserState = {
  ready: boolean;
  user: (PublicUser & { onboardingCompleted: boolean }) | null;
};

const ONBOARDING_KEY = "challenger_user_onboarding";
const AUTH_CHANGE_EVENT = "challenger-auth-change";

type OnboardingDatabase = Record<string, boolean>;

function readOnboardingDatabase(): OnboardingDatabase {
  try {
    const value = localStorage.getItem(ONBOARDING_KEY);
    return value ? (JSON.parse(value) as OnboardingDatabase) : {};
  } catch {
    return {};
  }
}

function isOnboardingCompleted(userId: string) {
  return readOnboardingDatabase()[userId] ?? false;
}

function withClientMeta(user: PublicUser) {
  return { ...user, onboardingCompleted: isOnboardingCompleted(user.id) };
}

export async function fetchCurrentUser() {
  const response = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as { user: PublicUser | null };
  return data.user ? withClientMeta(data.user) : null;
}

export function markCurrentUserOnboardingCompleted(userId: string) {
  const database = readOnboardingDatabase();
  database[userId] = true;
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(database));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function useCurrentUser() {
  const [state, setState] = useState<CurrentUserState>({ ready: false, user: null });

  useEffect(() => {
    let active = true;

    const syncUser = async () => {
      const user = await fetchCurrentUser();
      if (active) setState({ ready: true, user });
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);

    return () => {
      active = false;
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
    };
  }, []);

  return state;
}
