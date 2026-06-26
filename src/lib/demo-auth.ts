"use client";

import { useEffect, useState } from "react";

export type DemoUser = {
  id: string;
  name: string;
  login: string;
  password: string;
  coinsBalance: number;
  onboardingCompleted: boolean;
  acceptedChallengeIds: string[];
  completedChallengeIds: string[];
  createdAt: string;
  lastLoginAt?: string;
};

const USERS_KEY = "challengerDemoUsers";
const CURRENT_USER_KEY = "challengerDemoCurrentUserId";
const AUTH_CHANGE_EVENT = "challenger-demo-auth-change";

function readUsers(): DemoUser[] {
  try {
    const value = localStorage.getItem(USERS_KEY);
    return value ? (JSON.parse(value) as DemoUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: DemoUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function registerDemoUser(input: { name: string; login: string; password: string }) {
  const name = input.name.trim();
  const login = input.login.trim();
  const password = input.password;

  if (!name || !login || !password.trim()) {
    return { ok: false as const, error: "Заполните все поля." };
  }

  const users = readUsers();
  if (users.some((user) => user.login.toLocaleLowerCase() === login.toLocaleLowerCase())) {
    return { ok: false as const, error: "Этот логин уже занят. Попробуйте другой." };
  }

  const user: DemoUser = {
    id: createId(),
    name,
    login,
    // Demo-only: passwords must never be stored in plain text in production.
    password,
    coinsBalance: 1250,
    onboardingCompleted: false,
    acceptedChallengeIds: [],
    completedChallengeIds: [],
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  return { ok: true as const, user };
}

export function loginDemoUser(loginInput: string, password: string) {
  const login = loginInput.trim().toLocaleLowerCase();
  const users = readUsers();
  const index = users.findIndex(
    (user) => user.login.toLocaleLowerCase() === login && user.password === password,
  );

  if (index === -1) return null;

  const user = { ...users[index], lastLoginAt: new Date().toISOString() };
  users[index] = user;
  localStorage.setItem(CURRENT_USER_KEY, user.id);
  writeUsers(users);
  return user;
}

export function getCurrentDemoUser() {
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  return currentUserId ? readUsers().find((user) => user.id === currentUserId) ?? null : null;
}

export function completeCurrentUserOnboarding() {
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) return null;

  const users = readUsers();
  const index = users.findIndex((user) => user.id === currentUserId);
  if (index === -1) return null;

  const user = { ...users[index], onboardingCompleted: true };
  users[index] = user;
  writeUsers(users);
  return user;
}

export function updateCurrentDemoUserName(nameInput: string) {
  const name = nameInput.trim();
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId || !name) return null;

  const users = readUsers();
  const index = users.findIndex((user) => user.id === currentUserId);
  if (index === -1) return null;

  const user = { ...users[index], name };
  users[index] = user;
  writeUsers(users);
  return user;
}

export function useCurrentDemoUser() {
  const [state, setState] = useState<{ ready: boolean; user: DemoUser | null }>({ ready: false, user: null });

  useEffect(() => {
    const syncUser = () => setState({ ready: true, user: getCurrentDemoUser() });
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
    };
  }, []);

  return state;
}
