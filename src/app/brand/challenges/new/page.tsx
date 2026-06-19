import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Coins,
  Eye,
  Footprints,
  Gift,
  MapPin,
  QrCode,
  Save,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";
import { Button, buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const campaign = getBrandChallenges(companyBrand.id)[0];
const brandLocations = getBrandLocations(companyBrand.id);

const steps = ["Основное", "Механика", "Награда", "Точки", "Превью"];

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : undefined}>
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800">
        {value}
      </div>
    </label>
  );
}

function Option({ icon: Icon, title, detail, selected = false }: { icon: LucideIcon; title: string; detail: string; selected?: boolean }) {
  return (
    <div className={`relative rounded-2xl border p-4 ${selected ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      {selected ? <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-3 w-3" /></span> : null}
      <Icon className={`h-5 w-5 ${selected ? "text-emerald-700" : "text-slate-400"}`} />
      <div className="mt-3 text-sm font-black">{title}</div>
      <div className="mt-1 pr-4 text-xs leading-5 text-slate-500">{detail}</div>
    </div>
  );
}

function Section({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[30px] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">{number}</span>
        <div><h2 className="text-xl font-black">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function NewChallengePage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-400">Конструктор кампании · Coffee Place</div>
          <h1 className="mt-1 text-3xl font-black">Новый челлендж</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Настройте механику, награду и точки. Все значения демонстрационные — ничего не публикуется.</p>
        </div>
        <Link href={routes.brand.challenges} className={buttonClasses({ variant: "ghost" })}>К списку челленджей</Link>
      </header>

      <nav aria-label="Этапы настройки" className="overflow-x-auto rounded-[24px] bg-white p-2 shadow-sm">
        <ol className="flex min-w-max items-center">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center">
              <div className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-black ${index === 0 ? "bg-slate-950 text-white" : "text-slate-500"}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${index === 0 ? "bg-white/15" : "bg-slate-100"}`}>{index + 1}</span>{step}
              </div>
              {index < steps.length - 1 ? <ChevronRight className="mx-1 h-4 w-4 text-slate-300" /> : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Section number="1" title="Основное" description="Название и описание, которые увидит гость.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Название челленджа" value={campaign.title} />
              <Field label="Бренд" value={companyBrand.name} />
              <Field label="Категория" value="Кофе и визиты" />
              <Field label="Короткое описание" value="Посетите пять Coffee Place за неделю и получите награду." />
            </div>
          </Section>

          <Section number="2" title="Механика и условия" description="Как участник выполняет задание и получает прогресс.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Option icon={QrCode} title="QR-визит" detail="Сканирование кода на кассе" />
              <Option icon={Target} title="Серия визитов" detail="Несколько визитов за период" selected />
              <Option icon={Footprints} title="Шаги / активность" detail="Цель по активности гостя" />
              <Option icon={Coins} title="Вход за монетки" detail="Платное участие в челлендже" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Основное условие" value="5 визитов за 7 дней" />
              <Field label="Альтернативная активность" value="10 000 шагов" />
              <Field label="Ограничение" value="Посещение конкретных точек" wide />
            </div>
          </Section>

          <Section number="3" title="Награда" description="Что получит гость после выполнения условия.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Option icon={Coins} title="200 монеток" detail="Начисление в кошелёк" />
              <Option icon={Gift} title="Напиток на выбор" detail="Основная награда кампании" selected />
              <Option icon={Sparkles} title="Скидка / бонус" detail="Промо-предложение бренда" />
            </div>
          </Section>

          <Section number="4" title="География" description={`Выбрано ${brandLocations.length} из ${companyBrand.locationsCount} точек Coffee Place.`}>
            <div className="space-y-2">
              {brandLocations.map((location) => (
                <div key={location.id} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white"><Check className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-black">{location.title}</div><div className="truncate text-xs text-slate-500">{location.address} · {location.district}</div></div>
                  <Badge variant="success">Выбрана</Badge>
                </div>
              ))}
            </div>
          </Section>

          <Section number="5" title="Сроки и аудитория" description="Период кампании и сегменты, которым она будет показана.">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Дата старта" value="24 июня 2026" />
              <Field label="Дата окончания" value="31 июля 2026" />
              <Field label="Длительность" value="38 дней" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Option icon={Users} title="Новые гости" detail="Первый визит за 30 дней" selected />
              <Option icon={Users} title="Постоянные гости" detail="От 3 визитов за месяц" selected />
              <Option icon={MapPin} title="Гости рядом" detail="Находятся рядом с точками" selected />
            </div>
          </Section>

          <div className="flex flex-wrap items-center gap-3 rounded-[28px] bg-white p-4 shadow-sm">
            <Button variant="secondary" disabled title="Демо-режим: сохранение не требуется" className="cursor-not-allowed opacity-60"><Save className="h-4 w-4" />Сохранить черновик</Button>
            <Link href={routes.brand.preview} className={buttonClasses({ variant: "dark" })}><Eye className="h-4 w-4" />Посмотреть превью</Link>
            <span className="text-xs text-slate-400">Демо-режим · изменения не сохраняются</span>
          </div>
        </div>

        <aside className="self-start rounded-[32px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 xl:sticky xl:top-28">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold text-white/55">Превью для гостя</span><Badge variant="success">Черновик</Badge></div>
          <div className="mt-5 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl">{companyBrand.logo}</div><div><div className="font-black">{companyBrand.name}</div><div className="text-xs text-white/50">{brandLocations.length} точек выбрано</div></div></div>
          <div className="mt-6 text-4xl">{campaign.emoji}</div>
          <h2 className="mt-3 text-2xl font-black">{campaign.title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">Посетите пять Coffee Place за неделю и откройте напиток на выбор.</p>
          <div className="mt-5 space-y-2 text-sm font-bold">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><Target className="h-5 w-5 text-emerald-300" />5 визитов за 7 дней</div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><Gift className="h-5 w-5 text-amber-300" />Напиток на выбор + 200 монет</div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><CalendarDays className="h-5 w-5 text-sky-300" />24 июня — 31 июля</div>
          </div>
          <div className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
            <div className="flex justify-between text-sm"><span className="font-black">Прогресс</span><span className="font-bold text-emerald-700">3 из 5</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-3/5 rounded-full bg-emerald-500" /></div>
            <div className="mt-2 text-xs text-slate-500">Осталось 2 визита до награды</div>
          </div>
          <Link href={routes.brand.preview} className={buttonClasses({ variant: "secondary", className: "mt-5 w-full" })}>Открыть полный экран<Eye className="h-4 w-4" /></Link>
        </aside>
      </div>
    </main>
  );
}
