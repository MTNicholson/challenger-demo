"use client";

import { Heart } from "lucide-react";
import { MouseEvent } from "react";
import { cn } from "@/lib/cn";
import type { FavoriteType } from "@/lib/favorite-storage";
import { toggleFavoriteItem, useFavoriteItems } from "@/lib/favorite-storage";
import { useCurrentUser } from "@/lib/auth-client";

type FavoriteToggleButtonProps = {
  id: string;
  type: FavoriteType;
  className?: string;
  activeClassName?: string;
  label?: string;
};

export function FavoriteToggleButton({
  id,
  type,
  className,
  activeClassName,
  label,
}: FavoriteToggleButtonProps) {
  const { user } = useCurrentUser();
  const { items } = useFavoriteItems(user?.id);
  const isActive = items.some((item) => item.type === type && item.id === id);
  const fallbackLabel = isActive ? "Убрать из избранного" : "Добавить в избранное";

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!user) return;
    toggleFavoriteItem(user.id, type, id);
  }

  return (
    <button
      type="button"
      className={cn(className, isActive && activeClassName)}
      onClick={handleClick}
      aria-label={label ?? fallbackLabel}
      aria-pressed={isActive}
    >
      <Heart size={17} fill={isActive ? "currentColor" : "none"} />
    </button>
  );
}
