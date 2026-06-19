"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Coins,
  Footprints,
  Store,
} from "lucide-react";
import { routes } from "@/lib/routes";
import styles from "./landing.module.css";

const steps = [
  { icon: Store, title: "Бренд запускает челлендж", text: "Настраивает действие, награду и точки участия.", tone: "bg-blue-100 text-blue-700" },
  { icon: Footprints, title: "Пользователь действует", text: "Находит механику рядом и проходит её в городе.", tone: "bg-violet-100 text-violet-700" },
  { icon: Coins, title: "Получает монетки", text: "Видит прогресс, копит валюту и открывает подарки.", tone: "bg-amber-100 text-amber-700" },
  { icon: BarChart3, title: "Бизнес видит результат", text: "Измеряет активации, визиты и возврат аудитории.", tone: "bg-emerald-100 text-emerald-700" },
];

const partners = [
  ["CP", "Coffee Place"], ["F+", "FitPro"], ["BS", "Beauty Store"],
  ["SD", "Sweetly Desserts"], ["BK", "Book Space"], ["PC", "Pet Care"],
  ["FL", "Flow Studio"], ["UR", "Urban Run"], ["NM", "Noma Market"],
  ["WL", "Well Lab"], ["GR", "Green Room"], ["MV", "Move Club"],
];

const challenges = [
  { brand: "Coffee Place", category: "Кофе", title: "Кофейный маршрут", icon: "☕", meta: "482 участника", reward: "+200 монет", progress: 64, className: styles.coffeeCard },
  { brand: "FitPro", category: "Фитнес", title: "10 000 шагов", icon: "↗", meta: "931 участник", reward: "+200 монет", progress: 78, className: styles.fitCard },
  { brand: "Sweetly Desserts", category: "Десерты", title: "Сладкий июнь", icon: "✦", meta: "367 участников", reward: "Десерт", progress: 48, className: styles.sweetCard },
  { brand: "Book Space", category: "Книги", title: "Книжный челлендж", icon: "B", meta: "154 участника", reward: "+140 монет", progress: 36, className: styles.bookCard },
];

const userBenefits = ["Челленджи рядом на карте", "Прогресс и достижения", "Монетки за реальные действия", "Ежедневный игровой ритм", "Подарки и бонусы брендов"];

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className={`grid h-10 w-10 place-items-center rounded-[15px] text-base font-black shadow-lg ${inverse ? "bg-white text-[#181d3a] shadow-black/20" : "bg-[#181d3a] text-white shadow-indigo-950/15"}`}>Ч</span>
      <span className="text-[17px] font-black tracking-[-0.03em]">Челленджер</span>
    </span>
  );
}

function PhonePreview() {
  return (
    <div className={`${styles.phoneAssetWrap} relative mx-auto w-[260px] sm:w-[300px] lg:w-[320px]`}>
      <div className={styles.phoneAssetShadow} />
      <Image
        src="/landing/assets/hero-phone-3q.webp"
        alt="Интерфейс приложения Челленджер на смартфоне"
        width={586}
        height={1333}
        priority
        className={`${styles.phoneAsset} relative z-20 h-auto w-full`}
      />
    </div>
  );
}

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);

  function handleHeroPointerMove(event: MouseEvent<HTMLElement>) {
    if (!heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    heroRef.current.style.setProperty("--star-x", `${(-x * 12).toFixed(2)}px`);
    heroRef.current.style.setProperty("--star-y", `${(-y * 9).toFixed(2)}px`);
    heroRef.current.style.setProperty("--blue-coin-x", `${(x * 15).toFixed(2)}px`);
    heroRef.current.style.setProperty("--blue-coin-y", `${(y * 10).toFixed(2)}px`);
    heroRef.current.style.setProperty("--gold-coin-x", `${(x * 18).toFixed(2)}px`);
    heroRef.current.style.setProperty("--gold-coin-y", `${(y * 11).toFixed(2)}px`);
    heroRef.current.style.setProperty("--diamond-x", `${(x * 10).toFixed(2)}px`);
    heroRef.current.style.setProperty("--diamond-y", `${(y * 8).toFixed(2)}px`);
  }

  function resetHeroPointer() {
    for (const property of ["--star-x", "--star-y", "--blue-coin-x", "--blue-coin-y", "--gold-coin-x", "--gold-coin-y", "--diamond-x", "--diamond-y"]) {
      heroRef.current?.style.setProperty(property, "0px");
    }
  }

  return (
    <main className={`${styles.page} min-h-screen overflow-hidden bg-[#f7f8ff] text-[#181d3a]`}>
      <div className={`${styles.heroGlow} relative`}>
        <div className="mx-auto max-w-[1380px] px-4 sm:px-7 lg:px-10">
          <header className="relative z-50 pt-4 sm:pt-6">
            <div className={`${styles.navGlass} flex items-center justify-between rounded-full px-4 py-3 sm:px-5`}>
              <Link href="/"><BrandMark /></Link>
              <nav className="hidden items-center gap-7 text-sm font-bold text-slate-500 lg:flex">
                <a href="#product" className="transition hover:text-[#405de6]">Продукт</a><a href="#users" className="transition hover:text-[#405de6]">Для пользователей</a><a href="#business" className="transition hover:text-[#405de6]">Для бизнеса</a><a href="#demo" className="transition hover:text-[#405de6]">Демо</a>
              </nav>
              <div className="flex gap-2">
                <Link href={routes.user.home} className="hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-black transition hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex">Демо для гостей</Link>
                <Link href={routes.brand.dashboard} className="rounded-full bg-[#1b2040] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#405de6] hover:shadow-lg">Кабинет бренда</Link>
              </div>
            </div>
          </header>

          <section ref={heroRef} onMouseMove={handleHeroPointerMove} onMouseLeave={resetHeroPointer} id="product" className={`${styles.heroScene} relative grid min-h-[660px] items-center gap-0 py-7 lg:grid-cols-[.94fr_1.06fr] lg:py-8`}>
            <div className={`${styles.heroOrbit} pointer-events-none absolute inset-x-[7%] bottom-[1%] top-[13%] z-0 hidden lg:block`} />
            <Image src="/landing/assets/glass-star-blue.webp" alt="" width={938} height={1029} className={`${styles.heroStar} pointer-events-none absolute left-[42%] top-[1%] z-40 hidden w-[175px] lg:block`} />
            <Image src="/landing/assets/glass-coin-blue.webp" alt="" width={790} height={830} className={`${styles.heroAquaToken} pointer-events-none absolute left-[42%] top-[40%] z-40 hidden w-[176px] lg:block`} />
            <Image src="/landing/assets/glass-coin-gold.webp" alt="" width={881} height={906} className={`${styles.heroCoin} pointer-events-none absolute -right-[11%] top-[10%] z-50 hidden w-[300px] lg:block`} />
            <Image src="/landing/assets/glass-diamond-blue.webp" alt="" width={891} height={944} className={`${styles.heroCrystal} pointer-events-none absolute right-[-2%] bottom-[-1%] z-50 hidden w-[225px] lg:block`} />
            <div className={`${styles.bubble} ${styles.bubbleOne}`} /><div className={`${styles.bubble} ${styles.bubbleTwo}`} /><div className={`${styles.bubble} ${styles.bubbleThree}`} /><div className={`${styles.bubble} ${styles.bubbleFour}`} /><div className={`${styles.bubble} ${styles.bubbleFive}`} />
            <div className={`${styles.reveal} relative z-30 max-w-[650px]`}>
              <div className={`${styles.glassChip} inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-[#5261ca]`}><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> Инвесторское демо</div>
              <h1 className={`${styles.heroTitle} mt-6 text-[42px] font-bold leading-[.96] tracking-[-.052em] sm:text-[57px] lg:text-[62px]`}><span className={styles.titleLine}>Городские челленджи</span><br /><span className={styles.titleLineDelayed}>и награды</span><br /><span className={styles.titleLineDelayed}>за активность</span><br /><span className={`${styles.gradientText} ${styles.titleLineLast}`}>с любимыми</span><br /><span className={`${styles.gradientText} ${styles.titleLineLast}`}>брендами</span></h1>
              <p className="mt-5 max-w-[570px] text-[15px] leading-7 text-slate-600 sm:text-base">Челленджер соединяет офлайн-действия и цифровые награды. Пользователи получают выгоду и эмоции, а бренды — вовлечённость, лояльность и рост.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={routes.user.home} className={`${styles.primaryButton} inline-flex items-center justify-center gap-4 rounded-full px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-1`}>Открыть демо приложения <span className="grid h-8 w-8 place-items-center rounded-full bg-white/12 shadow-inner"><ArrowRight className="h-4 w-4" /></span></Link>
                <Link href={routes.brand.dashboard} className={`${styles.secondaryButton} inline-flex items-center justify-center gap-3 rounded-full px-5 py-3.5 text-sm font-black transition hover:-translate-y-1`}>Открыть кабинет бренда <ChevronRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">{["Без интеграций", "Быстрый старт", "Прозрачная аналитика"].map((x, i) => <span key={x} className={`${styles.helperChip} flex items-center gap-1.5 rounded-full px-3 py-2`}><span className="text-[#5261ca]">{["%", "✣", "▥"][i]}</span>{x}</span>)}</div>
            </div>

            <div className={`${styles.revealDelayed} relative min-h-[620px] lg:-ml-14`}>
              <div className={styles.sceneAura} />
              <div className={styles.lightColumns} />
              <Image src="/landing/assets/light-trail.svg" alt="" width={920} height={650} className={`${styles.lightTrail} absolute -bottom-4 left-1/2 z-0 w-[850px] max-w-none -translate-x-1/2`} />
              <Image src="/landing/glow-orbs.svg" alt="" width={760} height={620} className={`${styles.orbDrift} absolute inset-0 z-0 h-full w-full opacity-85`} />
              <div className="relative z-20 pt-1"><PhonePreview /></div>
              <Image src="/landing/assets/glass-star-blue.webp" alt="" width={938} height={1029} className={`${styles.floatReverse} absolute right-1 top-0 z-30 hidden w-24 sm:block lg:hidden`} />
              <Image src="/landing/assets/glass-diamond-blue.webp" alt="" width={891} height={944} className={`${styles.crystalFloat} absolute -right-8 bottom-0 z-30 hidden w-32 sm:block lg:hidden`} />
            </div>
          </section>

          <section className={`${styles.trustStrip} relative z-40 -mt-3 mb-0 overflow-hidden rounded-[30px] py-4`}>
            <div className="flex items-center gap-5 px-5 sm:px-8">
              <p className="relative z-10 shrink-0 text-[10px] font-black leading-4 text-[#202749]">Нам доверяют<br />бренды</p>
              <div className={styles.marqueeViewport}>
                <div className={styles.marqueeTrack}>
                  {[...partners, ...partners].map(([mark, name], i) => <div key={`${name}-${i}`} aria-hidden={i >= partners.length} className="flex shrink-0 items-center gap-2.5 px-4 text-[11px] font-black text-[#26304f]"><span className={`${styles.partnerMark} grid h-8 w-8 place-items-center rounded-full text-[9px]`}>{mark}</span><span>{name}</span></div>)}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className={`${styles.firstSection} relative mx-auto max-w-[1380px] px-5 py-10 sm:px-8 sm:py-12`}>
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#5261ca]">Как это работает</p><h2 className="mt-4 text-3xl font-black tracking-[-.045em] sm:text-5xl">Одна механика связывает город, пользователей и бренд</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500">Понятный путь от первого касания до повторного визита — без лишней сложности для участника.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{steps.map((step, i) => <article key={step.title} className={`${styles.liftCard} ${styles.firstGlassCard} group relative overflow-hidden rounded-[30px] p-6`}><div className={styles.cardShine} /><div className="relative flex items-center justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl ${step.tone}`}><step.icon className="h-5 w-5" /></span><span className="text-sm font-black text-slate-300">0{i + 1}</span></div><h3 className="relative mt-8 text-lg font-black">{step.title}</h3><p className="relative mt-3 text-sm leading-6 text-slate-500">{step.text}</p></article>)}</div>
      </section>

      <section id="users" className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-16">
        <div className="grid overflow-hidden rounded-[42px] border border-white bg-white/70 shadow-[0_30px_100px_rgba(61,72,118,.10)] backdrop-blur lg:grid-cols-2">
          <div className="relative overflow-hidden p-7 sm:p-12 lg:p-14"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/80 blur-2xl" /><p className="relative text-xs font-black uppercase tracking-[.2em] text-blue-600">Для пользователей</p><h2 className="relative mt-4 max-w-lg text-3xl font-black tracking-[-.045em] sm:text-4xl">Каждый день — новый повод выйти в город</h2><div className="relative mt-9 space-y-3">{userBenefits.map((x, i) => <div key={x} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 text-sm font-bold"><span className={`grid h-8 w-8 place-items-center rounded-xl ${i % 2 ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"}`}><Check className="h-4 w-4" /></span>{x}</div>)}</div></div>
          <div id="business" className={`${styles.metricPanel} p-7 text-white sm:p-12 lg:p-14`}><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">Для бизнеса</p><h2 className="mt-4 max-w-lg text-3xl font-black tracking-[-.045em] sm:text-4xl">Вовлечение, которое видно в цифрах</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/55">Управляйте механиками и наблюдайте, как игровые действия превращаются в измеримый результат.</p><div className="mt-10 grid grid-cols-2 gap-3">{[["+31%", "повторных визитов"], ["4 560", "подписчиков бренда"], ["1 208", "активаций наград"], ["7", "точек сети"]].map(([value, label]) => <div key={label} className="rounded-[24px] border border-white/10 bg-white/[.07] p-5 backdrop-blur"><p className="text-2xl font-black text-white sm:text-3xl">{value}</p><p className="mt-2 text-xs leading-5 text-white/50">{label}</p></div>)}</div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-[#5261ca]">Челленджи в городе</p><h2 className="mt-4 text-3xl font-black tracking-[-.045em] sm:text-5xl">Механики, в которые хочется включиться</h2></div><Link href={routes.user.challenges} className="inline-flex items-center gap-2 text-sm font-black text-[#405de6]">Смотреть все челленджи <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{challenges.map((card) => <article key={card.title} className={`${styles.challengeCard} ${card.className} relative min-h-[390px] overflow-hidden rounded-[32px] p-6`}><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-white/10" /><div className="relative flex items-center justify-between"><span className="rounded-full bg-white/50 px-3 py-1.5 text-[10px] font-black backdrop-blur">{card.category}</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/55 text-xl font-black shadow-sm backdrop-blur">{card.icon}</span></div><div className="absolute inset-x-6 bottom-6"><p className="text-xs font-bold opacity-55">{card.brand}</p><h3 className="mt-2 text-2xl font-black leading-tight">{card.title}</h3><div className="mt-6 flex items-center justify-between text-[11px] font-bold"><span>{card.meta}</span><span>{card.reward}</span></div><div className="mt-3 h-1.5 rounded-full bg-black/10"><div className="h-full rounded-full bg-current opacity-70" style={{ width: `${card.progress}%` }} /></div></div></article>)}</div>
      </section>

      <section id="demo" className="mx-auto max-w-[1280px] px-5 pb-10 sm:px-8 sm:pb-16">
        <div className={`${styles.finalCta} relative overflow-hidden rounded-[42px] px-6 py-16 text-center text-white shadow-2xl shadow-indigo-950/20 sm:px-12 sm:py-24`}><div className="absolute left-[10%] top-0 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" /><div className="absolute bottom-0 right-[10%] h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" /><Image src="/landing/star-glass.svg" alt="" width={130} height={130} className={`${styles.floatSlow} absolute -left-5 top-10 hidden w-28 opacity-60 md:block`} /><Image src="/landing/token.svg" alt="" width={110} height={110} className={`${styles.floatReverse} absolute -right-3 bottom-8 hidden w-24 opacity-70 md:block`} /><div className="relative mx-auto max-w-3xl"><span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-blue-200 backdrop-blur">Готово к просмотру</span><h2 className="mt-6 text-3xl font-black tracking-[-.05em] sm:text-5xl">Превратите офлайн-визиты в измеримую вовлечённость</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-white/60">Пройдите готовый сценарий глазами пользователя или откройте кабинет бренда с моковой аналитикой.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href={routes.user.home} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-[#202749] transition hover:-translate-y-1 hover:shadow-xl">Пройти пользовательское демо <ArrowRight className="h-4 w-4" /></Link><Link href={routes.brand.dashboard} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">Открыть кабинет бренда</Link></div></div></div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-5 px-5 py-8 text-center text-xs text-slate-400 sm:flex-row sm:px-8 sm:text-left"><BrandMark /><p>Инвесторское демо · frontend-прототип · данные моковые</p><div className="flex gap-5 font-bold"><a href="#product">Продукт</a><a href="#demo">Демо</a></div></footer>
    </main>
  );
}
