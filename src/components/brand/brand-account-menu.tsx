"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ChevronDown, Loader2, LogOut, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import type { BrandIdentity } from "./brand-types";

type BrandAccountMenuProps = {
  brand: BrandIdentity;
};

function getInitial(name: string) {
  return name.trim()[0]?.toLocaleUpperCase("ru-RU") ?? "Б";
}

export function BrandAccountMenu({ brand }: BrandAccountMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = getInitial(brand.name);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/brand/auth/logout", { method: "POST" });
    } finally {
      router.replace(routes.brandAuth.login);
      router.refresh();
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex max-w-[260px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-blue-600 text-xs font-black text-white">
          {brand.logoUrl ? (
            <span
              aria-label={`Логотип ${brand.name}`}
              className="h-full w-full bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url(${brand.logoUrl})` }}
            />
          ) : (
            initial
          )}
        </span>
        <span className="hidden max-w-[150px] truncate sm:inline">{brand.name}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
          role="menu"
        >
          <div className="mb-1 flex items-center gap-3 border-b border-slate-100 px-2 pb-3 pt-1">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Building2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-slate-900">{brand.name}</div>
              <div className="text-xs font-bold text-slate-400">Аккаунт бренда</div>
            </div>
          </div>

          <Link className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" href={routes.brand.settings} role="menuitem" onClick={() => setOpen(false)}>
            <Settings className="h-4 w-4" />
            Настройки
          </Link>
          <button className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-400" disabled type="button">
            <Plus className="h-4 w-4" />
            Добавить компанию
          </button>
          <button
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-extrabold text-rose-600 transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-70"
            disabled={loggingOut}
            role="menuitem"
            type="button"
            onClick={handleLogout}
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Выйти
          </button>
        </div>
      ) : null}
    </div>
  );
}
