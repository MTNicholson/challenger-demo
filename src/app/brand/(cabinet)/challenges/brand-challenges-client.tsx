"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { BarChart3, CalendarClock, CheckCircle2, Eye, FileText, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import type { BrandChallengeDto, BrandChallengeStatus } from "@/lib/brand-challenges";
import { routes } from "@/lib/routes";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";

type Tab = "all" | BrandChallengeStatus;

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "draft", label: "Черновики" },
  { id: "scheduled", label: "Запланированные" },
  { id: "completed", label: "Завершённые" },
];

const statusLabels: Record<BrandChallengeStatus, string> = {
  active: "Активен",
  draft: "Черновик",
  scheduled: "Запланирован",
  completed: "Завершён",
};

const statusStyles: Record<BrandChallengeStatus, string> = {
  active: "border-emerald-100 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-100 text-slate-600",
  scheduled: "border-violet-100 bg-violet-50 text-violet-700",
  completed: "border-blue-100 bg-blue-50 text-blue-700",
};

function formatPeriod(challenge: BrandChallengeDto) {
  if (!challenge.startsAt || !challenge.endsAt) return "Период не указан";
  const format = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit" }).format(new Date(value));
  return `${format(challenge.startsAt)} — ${format(challenge.endsAt)}`;
}

function getEffectiveStatus(challenge: BrandChallengeDto): BrandChallengeStatus {
  if (challenge.status === "active" && challenge.endsAt && new Date(challenge.endsAt) < new Date()) return "completed";
  return challenge.status as BrandChallengeStatus;
}

export function BrandChallengesClient({ brandName, challenges }: { brandName: string; challenges: BrandChallengeDto[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const filteredChallenges = useMemo(() => challenges.filter((challenge) => {
    const status = getEffectiveStatus(challenge);
    return (tab === "all" || status === tab) && challenge.title.toLocaleLowerCase("ru-RU").includes(query.trim().toLocaleLowerCase("ru-RU"));
  }), [challenges, query, tab]);
  const countFor = (status: Tab) => status === "all" ? challenges.length : challenges.filter((challenge) => getEffectiveStatus(challenge) === status).length;

  return (
    <main className="space-y-6">
      <BrandPageHeader
        actionHref={undefined}
        actionIcon={PlusCircle}
        actionLabel="Создать челлендж"
        description={`Все кампании ${brandName}: от черновика до публикации и завершения.`}
        eyebrow="Кампании"
        title="Челленджи"
      />

      <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.03] sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="brand-field flex h-12 flex-1 items-center gap-3 rounded-xl px-4 text-slate-500">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <span className="sr-only">Поиск по названию</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400" />
          </label>
          <Link href={routes.brand.newChallenge} className={buttonClasses({ variant: "primary", className: "h-12 rounded-xl px-5" })}><PlusCircle className="h-4 w-4" />Создать челлендж</Link>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-100" role="tablist" aria-label="Статусы челленджей">
          {tabs.map((item) => (
            <button key={item.id} role="tab" aria-selected={tab === item.id} type="button" onClick={() => setTab(item.id)} className={`shrink-0 border-b-2 px-4 pb-3 text-sm font-black transition ${tab === item.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
              {item.label} <span className="ml-1 text-xs font-bold opacity-70">{countFor(item.id)}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-[minmax(250px,1.5fr)_130px_160px_105px_130px] items-center gap-4 px-4 pb-3 text-xs font-black uppercase tracking-[0.1em] text-slate-400">
              <span>Название</span><span>Статус</span><span>Период</span><span>Точки</span><span className="text-right">Действия</span>
            </div>
            <div className="space-y-2">
              {filteredChallenges.map((challenge) => {
                const status = getEffectiveStatus(challenge);
                return (
                  <article key={challenge.id} className="grid grid-cols-[minmax(250px,1.5fr)_130px_160px_105px_130px] items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-900/[0.02] transition hover:border-blue-100 hover:bg-blue-50/[0.16]">
                    <div className="flex min-w-0 items-center gap-3">
                      {challenge.heroImageUrl ? <Image src={challenge.heroImageUrl} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><FileText className="h-5 w-5" /></span>}
                      <div className="min-w-0"><h2 className="truncate text-sm font-black text-slate-900">{challenge.title}</h2><p className="mt-1 truncate text-xs font-semibold text-slate-400">{challenge.reward ?? "Награда не указана"}</p></div>
                    </div>
                    <span className={`w-fit rounded-lg border px-2.5 py-1 text-xs font-black ${statusStyles[status] ?? "border-slate-200 bg-slate-100 text-slate-600"}`}>{statusLabels[status] ?? "Без статуса"}</span>
                    <span className="text-sm font-bold text-slate-600">{status === "scheduled" && challenge.scheduledAt ? `Публикация ${new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(challenge.scheduledAt))}` : formatPeriod(challenge)}</span>
                    <span className="text-sm font-bold text-slate-600">{challenge.locationIds.length}</span>
                    <div className="flex justify-end gap-1">
                      <Link href={`${routes.brand.newChallenge}?challengeId=${encodeURIComponent(challenge.id)}`} aria-label="Открыть челлендж" className={buttonClasses({ variant: "ghost", size: "sm", className: "h-9 w-9 rounded-xl p-0" })}><Eye className="h-4 w-4" /></Link>
                      <Link href={routes.brand.analytics} aria-label="Аналитика" className={buttonClasses({ variant: "ghost", size: "sm", className: "h-9 w-9 rounded-xl p-0" })}>{status === "scheduled" ? <CalendarClock className="h-4 w-4" /> : status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}</Link>
                      <Link href={`${routes.brand.newChallenge}?challengeId=${encodeURIComponent(challenge.id)}`} aria-label="Ещё" className={buttonClasses({ variant: "ghost", size: "sm", className: "h-9 w-9 rounded-xl p-0" })}><MoreHorizontal className="h-4 w-4" /></Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        {!filteredChallenges.length ? <div className="grid place-items-center gap-2 py-16 text-center"><FileText className="h-8 w-8 text-slate-300" /><h2 className="font-black text-slate-800">Нет челленджей</h2><p className="max-w-sm text-sm leading-6 text-slate-500">Создайте новый челлендж или измените фильтр поиска.</p></div> : null}
      </section>
    </main>
  );
}
