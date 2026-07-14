"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Gift, LayoutDashboard, Lock, LogOut, QrCode, ScrollText, Target, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

type Mode = "STANDARD" | "EXTENDED" | "FLAGSHIP";
type Role = "LOCATION_ADMIN" | "LOCATION_STAFF";
type Props = { children: React.ReactNode; brandName: string; locationName: string; address: string; mode: Mode; role: Role };

const modeName: Record<Mode, string> = { STANDARD: "Standard", EXTENDED: "Extended", FLAGSHIP: "Flagship" };

export function LocationShell({ children, brandName, locationName, address, mode, role }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = role === "LOCATION_ADMIN";
  const hasExtendedAccess = mode === "EXTENDED" || mode === "FLAGSHIP";
  const items = isAdmin
    ? [
        { label: "Главная", href: routes.location.dashboard, icon: LayoutDashboard },
        { label: "Аналитика точки", href: routes.location.analytics, icon: BarChart3 },
        { label: "Сотрудники", href: routes.location.employees, icon: Users },
        { label: "Сканер", href: routes.location.scanner, icon: QrCode },
        { label: "Лог сканирований", href: routes.location.scanLog, icon: ScrollText },
        { label: "Челленджи", href: routes.location.challenges, icon: Target, locked: !hasExtendedAccess },
        { label: "Награды", href: routes.location.rewards, icon: Gift, locked: !hasExtendedAccess },
      ]
    : [
        { label: "Сканер", href: routes.location.scanner, icon: QrCode },
        { label: "Лог сканирований", href: routes.location.scanLog, icon: ScrollText },
      ];

  async function logout() {
    await fetch("/api/location/auth/logout", { method: "POST" });
    router.replace("/brand/auth/login?mode=location");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-5">
            <p className="text-[11px] font-black uppercase tracking-[.15em] text-blue-700">Челленджер · точка</p>
            <h1 className="mt-2 truncate font-black">{locationName || "Точка бренда"}</h1>
            <p className="mt-1 truncate text-xs font-bold text-slate-400">{brandName}</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              if (item.locked) {
                return <div key={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-400" title="Недоступно в режиме Standard"><Lock className="h-[18px] w-[18px]" /><span>{item.label}</span></div>;
              }
              return <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold", active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}><Icon className="h-[18px] w-[18px]" /><span>{item.label}</span></Link>;
            })}
          </nav>
          <div className="border-t border-slate-200 p-3"><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold text-slate-600 hover:bg-slate-50"><LogOut className="h-[18px] w-[18px]" />Выйти</button></div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div><p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-slate-400">Кабинет точки · {modeName[mode]}</p><p className="font-black">{address}</p></div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{isAdmin ? "Администратор точки" : "Сотрудник точки"}</span>{mode === "FLAGSHIP" ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Автономный режим</span> : null}</div>
          </header>
          <main className="mx-auto w-full max-w-[1280px] px-6 py-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
