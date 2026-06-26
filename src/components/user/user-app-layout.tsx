"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import { routes } from "@/lib/routes";
import { useCurrentDemoUser } from "@/lib/demo-auth";
import { UserBottomNav } from "./user-bottom-nav";
import styles from "./user-phone-shell.module.css";

type UserAppLayoutProps = {
  children: ReactNode;
};

export function UserAppLayout({ children }: UserAppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user } = useCurrentDemoUser();
  const presentationRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !user) router.replace(routes.auth.login);
    else if (user && !user.onboardingCompleted) router.replace(routes.onboarding);
  }, [ready, router, user]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousScrollRestoration = window.history.scrollRestoration;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.history.scrollRestoration = "manual";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    let secondFrame = 0;
    const resetScroll = () => {
      presentationRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      scrollViewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    resetScroll();
    const firstFrame = window.requestAnimationFrame(() => {
      resetScroll();
      secondFrame = window.requestAnimationFrame(resetScroll);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [pathname]);

  if (!ready || !user || !user.onboardingCompleted) return null;

  return (
    <div ref={presentationRef} className={styles.presentation}>
      <div className={styles.auroraMint} />
      <div className={styles.auroraLilac} />
      <div className={styles.ambientOrbOne} />
      <div className={styles.ambientOrbTwo} />

      <aside className={styles.presentationAside}>
        <div className={styles.demoLabel}>
          <span>Ч</span>
          <div>
            <strong>Челленджер</strong>
            <small>пользовательское приложение</small>
          </div>
        </div>
        <nav className={styles.asideActions} aria-label="Переходы из демо приложения">
          <Link className={styles.asidePrimary} href={routes.marketing.home}>
            <ArrowLeft size={16} />
            Вернуться на главную
          </Link>
          <Link className={styles.asideSecondary} href={routes.brand.dashboard}>
            <Building2 size={16} />
            Открыть кабинет бренда
          </Link>
        </nav>
      </aside>

      <div className={styles.phone}>
        <span className={styles.volumeUp} />
        <span className={styles.volumeDown} />
        <span className={styles.powerButton} />

        <div className={styles.screen}>
          <div className={styles.dynamicIsland} aria-hidden="true">
            <span />
          </div>

          <div key={pathname} ref={scrollViewportRef} className={styles.appViewport}>
            <div className={styles.appContent}>{children}</div>
          </div>

          <UserBottomNav />
          <div id="user-app-overlay-root" className={styles.overlayRoot} />
          <div className={styles.homeIndicator} aria-hidden="true" />
        </div>
      </div>

      <p className={styles.presentationHint} aria-hidden="true">
        Интерактивный прототип · листайте внутри экрана
      </p>
    </div>
  );
}
