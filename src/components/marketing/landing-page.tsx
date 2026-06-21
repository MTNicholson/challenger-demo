"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock,
  Repeat2,
  Users,
} from "lucide-react";
import { routes } from "@/lib/routes";
import styles from "./landing.module.css";

const steps = [
  { asset: "/landing/assets/process-flag-final.webp", title: "Бренд запускает челлендж", text: "Задаёт цель, награды, условия и локации.", accent: "mint" },
  { asset: "/landing/assets/process-sneaker-final.webp", title: "Пользователь выполняет действия", text: "Посещает места, сканирует QR, проходит задания.", accent: "lilac" },
  { asset: "/landing/assets/process-coin-final.webp", title: "Получает монеты и награды", text: "Копит монеты, открывает бейджи и призы.", accent: "gold" },
  { asset: "/landing/assets/process-growth-final.webp", title: "Бизнес получает результат", text: "Рост вовлечённости, повторных визитов и продаж.", accent: "sky" },
];

const partners = [
  ["CP", "Coffee Place"], ["F+", "FitPro"], ["BS", "Beauty Store"],
  ["SD", "Sweetly Desserts"], ["BK", "Book Space"], ["PC", "Pet Care"],
  ["FL", "Flow Studio"], ["UR", "Urban Run"], ["NM", "Noma Market"],
  ["WL", "Well Lab"], ["GR", "Green Room"], ["MV", "Move Club"],
];

const challenges = [
  { brand: "Coffee Place", mark: "CP", title: "Кофейный маршрут", description: "Посети 5 кофеен и получи фирменный термостакан", participants: "482 участника", duration: "7 дней", reward: "+200 монет", asset: "/landing/challenges/coffee.webp", className: styles.challengeCoffee },
  { brand: "FitPro", mark: "F+", title: "10 000 шагов", description: "Двигайся каждый день и забирай награды", participants: "931 участник", duration: "14 дней", reward: "+120 монет", asset: "/landing/challenges/sneaker.webp", className: styles.challengeFit },
  { brand: "Sweetly Desserts", mark: "SD", title: "Сладкий уикенд", description: "Попробуй 3 новинки и открой секретный подарок", participants: "367 участников", duration: "5 дней", reward: "+150 монет", asset: "/landing/challenges/dessert.webp", className: styles.challengeSweet },
  { brand: "Book Space", mark: "BK", title: "Книжный челлендж", description: "Прочитай книгу месяца и получи скидку", participants: "154 участника", duration: "10 дней", reward: "+130 монет", asset: "/landing/challenges/book.webp", className: styles.challengeBook },
  { brand: "Urban Gym", mark: "UG", title: "Сильнее каждый день", description: "Заверши 8 тренировок и открой бонус клуба", participants: "608 участников", duration: "21 день", reward: "+180 монет", asset: "/landing/challenges/dumbbell.webp", className: styles.challengeGym },
];

const userBenefits = ["Интересные челленджи рядом", "Монеты за активность", "Эксклюзивные награды и скидки", "Рейтинги и бейджи", "Локальные события и комьюнити"];

const businessMetrics = [
  { value: "+37%", label: "рост вовлечённости в бренде", icon: BarChart3 },
  { value: "4 680", label: "активных участников", icon: Users },
  { value: "1 240", label: "выполненных челленджей", icon: Check },
  { value: "92%", label: "вернулись повторно", icon: Repeat2 },
];

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
  const challengeCarouselRef = useRef<HTMLDivElement>(null);

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

  function scrollChallenges(direction: -1 | 1) {
    const carousel = challengeCarouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({ left: carousel.clientWidth * 0.78 * direction, behavior: "smooth" });
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
            <Image src="/landing/assets/hero-gold-star-coin.webp" alt="" width={866} height={926} className={`${styles.heroCoin} pointer-events-none absolute -right-[11%] top-[10%] z-50 hidden w-[292px] lg:block`} />
            <Image src="/landing/assets/glass-diamond-blue.webp" alt="" width={891} height={944} className={`${styles.heroCrystal} pointer-events-none absolute right-[-2%] bottom-[-1%] z-50 hidden w-[225px] lg:block`} />
            <div className={`${styles.bubble} ${styles.bubbleOne}`} /><div className={`${styles.bubble} ${styles.bubbleTwo}`} /><div className={`${styles.bubble} ${styles.bubbleThree}`} /><div className={`${styles.bubble} ${styles.bubbleFour}`} /><div className={`${styles.bubble} ${styles.bubbleFive}`} />
            <div className={`${styles.reveal} relative z-30 max-w-[650px]`}>
              <div className={`${styles.glassChip} inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-[#5261ca]`}><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> Инвесторское демо</div>
              <h1 className={`${styles.heroTitle} mt-6 text-[42px] font-bold leading-[.96] tracking-[-.052em] sm:text-[57px] lg:text-[62px]`}><span className={styles.titleLine}>Городские челленджи</span><br /><span className={styles.titleLineDelayed}>и награды</span><br /><span className={styles.titleLineDelayed}>за активность</span><br /><span className={`${styles.gradientText} ${styles.titleLineLast}`}>с любимыми</span><br /><span className={`${styles.gradientText} ${styles.titleLineLast}`}>брендами</span></h1>
              <p className="mt-5 max-w-[570px] text-[15px] leading-7 text-slate-600 sm:text-base">Челленджер соединяет офлайн-действия и цифровые награды. Пользователи получают выгоду и эмоции, а бренды — вовлечённость, лояльность и рост.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={routes.auth.register} className={`${styles.primaryButton} inline-flex items-center justify-center gap-4 rounded-full px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-1`}>Открыть демо приложения <span className="grid h-8 w-8 place-items-center rounded-full bg-white/12 shadow-inner"><ArrowRight className="h-4 w-4" /></span></Link>
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

      <section className={`${styles.firstSection} relative mx-auto max-w-[1380px] px-5 pb-5 pt-8 sm:px-8 sm:pb-7 sm:pt-10`}>
        <div className="mx-auto max-w-4xl text-center"><p className="text-[11px] font-black uppercase tracking-[.24em] text-[#5261ca]">Как это работает</p><h2 className="mt-3 text-3xl font-black tracking-[-.048em] text-[#171d3b] sm:text-[46px] sm:leading-[1.04]">Просто для пользователей. Эффективно для бизнеса.</h2></div>
        <div className={`${styles.processGrid} mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5`}>
          {steps.map((step, i) => (
            <article key={step.title} className={`${styles.liftCard} ${styles.processCard} ${styles[`process${step.accent}`]} group relative min-h-[280px] overflow-visible rounded-[32px] p-7`}>
              <div className="relative flex items-start justify-between">
                <span className={`${styles.processIcon} relative grid h-[88px] w-[88px] place-items-center rounded-[28px]`}><Image src={step.asset} alt="" fill sizes="88px" className="object-contain" /></span>
                <span className={`${styles.stepNumber} text-2xl font-black`}>0{i + 1}</span>
              </div>
              <h3 className="relative mt-7 max-w-[230px] text-xl font-black leading-[1.15] text-[#171d3b]">{step.title}</h3>
              <p className="relative mt-3 max-w-[240px] text-sm leading-6 text-slate-500">{step.text}</p>
              {i < steps.length - 1 ? <span className={styles.processConnector} aria-hidden="true"><ArrowRight className="h-4 w-4" /></span> : null}
            </article>
          ))}
        </div>
      </section>

      <section id="users" className="mx-auto max-w-[1380px] px-5 pb-14 pt-3 sm:px-8 sm:pb-20 sm:pt-5">
        <div className={`${styles.valueGrid} grid gap-5 lg:grid-cols-2`}>
          <article className={`${styles.valuePanel} ${styles.userPanel} relative min-h-[330px] overflow-hidden rounded-[36px] p-7 sm:p-9`}>
            <div className={styles.valueTopHighlight} />
            <p className="relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[.2em] text-emerald-700"><Users className="h-4 w-4" /> Для пользователей</p>
            <div className="relative mt-7 grid max-w-full gap-x-7 gap-y-4 pr-[30%] sm:max-w-[72%] sm:grid-cols-2 sm:pr-0">
              {userBenefits.map((benefit) => <div key={benefit} className="flex items-start gap-2.5 text-[13px] font-bold leading-5 text-[#26304f]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-[0_5px_12px_rgba(5,150,105,.2)]"><Check className="h-3 w-3" /></span>{benefit}</div>)}
            </div>
            <Image src="/landing/assets/gift-box-final.webp" alt="" width={1085} height={1146} className={`${styles.giftBox} absolute -bottom-5 -right-3 w-[195px] sm:w-[238px]`} />
          </article>

          <article id="business" className={`${styles.valuePanel} ${styles.businessPanel} relative min-h-[330px] overflow-hidden rounded-[36px] p-7 sm:p-9`}>
            <div className={styles.valueTopHighlight} />
            <p className="relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[.2em] text-sky-700"><BarChart3 className="h-4 w-4" /> Для бизнеса</p>
            <div className="relative mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {businessMetrics.map((metric) => <div key={metric.label} className={styles.kpiCard}><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-sky-100 text-sky-700"><metric.icon className="h-4 w-4" /></span><p className="mt-4 text-[25px] font-black tracking-[-.04em] text-[#171d3b]">{metric.value}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{metric.label}</p></div>)}
            </div>
            <p className="relative mt-6 text-[10px] text-slate-400">Данные на основе пилотных запусков в 12 городах</p>
          </article>
        </div>
      </section>

      <section className={`${styles.challengeSection} mx-auto max-w-[1380px] px-5 py-20 sm:px-8 sm:py-24`}>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-[11px] font-black uppercase tracking-[.24em] text-[#5261ca]">Примеры челленджей</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em] sm:text-[44px]">Механики, в которые хочется включиться</h2></div><Link href={routes.user.challenges} className="inline-flex items-center gap-2 text-sm font-black text-[#405de6]">Смотреть все <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="relative mt-10">
          <button type="button" aria-label="Предыдущие челленджи" onClick={() => scrollChallenges(-1)} className={`${styles.carouselControl} ${styles.carouselPrev}`}><ArrowLeft className="h-5 w-5" /></button>
          <div ref={challengeCarouselRef} className={styles.challengeCarousel}>
            {challenges.map((card) => (
              <article key={card.title} className={`${styles.challengePromoCard} ${card.className} group relative overflow-hidden rounded-[32px] p-6`}>
                <div className={styles.challengeInnerGlow} />
                <div className={styles.challengeVisual}><Image src={card.asset} alt="" fill sizes="(max-width: 639px) 72vw, (max-width: 1279px) 44vw, 22vw" className="object-contain" /></div>
                <div className="relative z-10 flex items-center justify-between gap-3"><span className="flex min-w-0 items-center gap-2.5"><span className={styles.challengeMark}>{card.mark}</span><span className="truncate text-[11px] font-bold">{card.brand}</span></span><span className={styles.rewardPill}>{card.reward}</span></div>
                <div className="relative z-10 mt-[72px] max-w-[62%]"><h3 className="text-[25px] font-black leading-[1.08] tracking-[-.04em]">{card.title}</h3><p className="mt-3 text-[12px] leading-5 opacity-70">{card.description}</p></div>
                <div className={styles.challengeStats}><span><Users className="h-3.5 w-3.5" />{card.participants}</span><span><Clock className="h-3.5 w-3.5" />{card.duration}</span></div>
              </article>
            ))}
          </div>
          <button type="button" aria-label="Следующие челленджи" onClick={() => scrollChallenges(1)} className={`${styles.carouselControl} ${styles.carouselNext}`}><ArrowRight className="h-5 w-5" /></button>
        </div>
        <div className={styles.carouselDots} aria-hidden="true"><span className={styles.carouselDotActive} /><span /><span /><span /><span /></div>
      </section>

      <section id="demo" className="mx-auto max-w-[1380px] px-5 pb-10 sm:px-8 sm:pb-16">
        <div className={`${styles.finalCta} relative grid overflow-hidden rounded-[40px] px-7 py-10 text-white sm:px-10 lg:grid-cols-[150px_1fr_1.25fr] lg:items-center lg:gap-8 lg:px-12`}>
          <div className={styles.ctaFlareLeft} /><div className={styles.ctaFlareRight} /><div className={styles.ctaShine} />
          <div className="relative hidden justify-center lg:flex"><div className={styles.ctaLogo}><span>Ч</span></div></div>
          <div className="relative"><h2 className="max-w-[470px] text-3xl font-black leading-[1.04] tracking-[-.045em] sm:text-[38px]">Запустите вовлечённость вместе с Челленджером</h2><p className="mt-4 max-w-[500px] text-sm leading-6 text-white/60">Попробуйте демо приложения или изучите кабинет бренда. Убедитесь, как просто это работает.</p></div>
          <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:mt-0">
            <div><Link href={routes.auth.register} className={styles.ctaPrimary}>Пройти демо для гостей <ArrowRight className="h-4 w-4" /></Link><p className="mt-2 text-center text-[10px] text-white/42">Займёт меньше минуты</p></div>
            <div><Link href={routes.brand.dashboard} className={styles.ctaSecondary}>Открыть кабинет бренда <ArrowRight className="h-4 w-4" /></Link><p className="mt-2 text-center text-[10px] text-white/42">Для команд и маркетологов</p></div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-5 px-5 py-8 text-center text-xs text-slate-400 sm:flex-row sm:px-8 sm:text-left"><BrandMark /><p>Инвесторское демо · frontend-прототип · данные моковые</p><div className="flex gap-5 font-bold"><a href="#product">Продукт</a><a href="#demo">Демо</a></div></footer>
    </main>
  );
}
