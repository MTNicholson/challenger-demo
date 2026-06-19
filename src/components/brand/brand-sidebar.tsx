import Link from "next/link";
import {
  BarChart3,
  Gift,
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { routes } from "@/lib/routes";

const items = [
  {
    label: "Dashboard",
    href: routes.brand.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Челленджи",
    href: routes.brand.challenges,
    icon: Target,
  },
  {
    label: "Создать",
    href: routes.brand.newChallenge,
    icon: PlusCircle,
  },
  {
    label: "Аналитика",
    href: routes.brand.analytics,
    icon: BarChart3,
  },
  {
    label: "Награды",
    href: routes.brand.rewards,
    icon: Gift,
  },
  {
    label: "Scanner",
    href: routes.brand.scanner,
    icon: QrCode,
  },
  {
    label: "Preview",
    href: routes.brand.preview,
    icon: Sparkles,
  },
];

export function BrandSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="mb-8 rounded-3xl bg-slate-950 p-4 text-white">
        <div className="text-sm font-semibold text-white/60">Челленджер</div>
        <div className="mt-1 text-xl font-bold">Coffee Place</div>
        <div className="mt-3 text-xs text-white/55">Brand cabinet demo</div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-950">
        <div className="font-semibold">Demo режим</div>
        <p className="mt-1 text-emerald-800/80">
          Данные моковые, но сценарии выглядят как реальный кабинет.
        </p>
      </div>
    </aside>
  );
}
