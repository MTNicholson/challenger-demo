"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { UserBottomNav } from "./user-bottom-nav";
import styles from "./challenge-phone-preview.module.css";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  resetKey?: string;
};

export function PhoneFrame({ children, className, resetKey }: PhoneFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [resetKey]);

  return (
    <div className={`${styles.frame} ${className ?? ""}`} aria-label="Предпросмотр карточки челленджа в приложении">
      <span className={styles.volumeUp} />
      <span className={styles.volumeDown} />
      <span className={styles.powerButton} />
      <div className={styles.screen}>
        <div className={styles.dynamicIsland} aria-hidden="true"><span /></div>
        <div key={resetKey} ref={viewportRef} data-user-scroll-viewport className={styles.appRoot}>
          <div className={styles.appContent}>{children}</div>
        </div>
        <UserBottomNav isPreview />
        <div className={styles.homeIndicator} aria-hidden="true" />
      </div>
    </div>
  );
}
