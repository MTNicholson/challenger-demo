"use client";

import { useEffect, useMemo, useState } from "react";

export type FavoriteType = "challenge" | "brand";

export type FavoriteItem = {
  id: string;
  type: FavoriteType;
  addedAt: string;
};

type FavoriteDatabase = Record<string, FavoriteItem[]>;

const STORAGE_KEY = "challenger_user_favorites";
const CHANGE_EVENT = "challenger-user-favorites-change";

function readDatabase(): FavoriteDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteDatabase) : {};
  } catch {
    return {};
  }
}

function writeDatabase(database: FavoriteDatabase) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function getUserItems(userId: string) {
  return readDatabase()[userId] ?? [];
}

export function isFavoriteItem(userId: string, type: FavoriteType, id: string) {
  return getUserItems(userId).some((item) => item.type === type && item.id === id);
}

export function addFavoriteItem(userId: string, type: FavoriteType, id: string, addedAt = new Date().toISOString()) {
  const database = readDatabase();
  const items = database[userId] ?? [];
  if (items.some((item) => item.type === type && item.id === id)) return;

  database[userId] = [...items, { id, type, addedAt }];
  writeDatabase(database);
}

export function removeFavoriteItem(userId: string, type: FavoriteType, id: string) {
  const database = readDatabase();
  const items = database[userId] ?? [];
  database[userId] = items.filter((item) => !(item.type === type && item.id === id));
  writeDatabase(database);
}

export function toggleFavoriteItem(userId: string, type: FavoriteType, id: string) {
  if (isFavoriteItem(userId, type, id)) {
    removeFavoriteItem(userId, type, id);
    return false;
  }

  addFavoriteItem(userId, type, id);
  return true;
}

export function useFavoriteItems(userId?: string | null) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const sync = () => {
      setItems(userId ? getUserItems(userId) : []);
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

  return useMemo(() => ({ ready, items }), [ready, items]);
}
