"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Coffee, Gift, MapPin, Sparkles, Timer, X } from "lucide-react";
import { demoNotifications, type DemoNotification } from "@/data/notifications";
import styles from "./user-home.module.css";

const notificationIcons: Record<DemoNotification["tone"], typeof Bell> = {
  coffee: Coffee,
  warning: Timer,
  gift: Gift,
  progress: Sparkles,
  reward: CheckCircle2,
  info: MapPin,
};

export function HomeHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const portalRoot = typeof document === "undefined" ? null : document.getElementById("user-app-overlay-root");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <header className={styles.homeHeader}>
        <h1>Привет, {name}! <span aria-hidden="true">👋</span></h1>
        <button className={`${styles.notificationButton} backdrop-blur-[18px] backdrop-saturate-[160%]`} type="button" aria-label="Открыть уведомления" aria-expanded={open} onClick={() => setOpen(true)}>
          <Bell size={20} />
          <span className={styles.notificationDot} />
        </button>
      </header>

      {open && portalRoot
        ? createPortal(
            <div className={styles.notificationOverlay} role="dialog" aria-modal="true" aria-labelledby="notifications-title">
              <button className={`${styles.notificationBackdrop} backdrop-blur-[10px] backdrop-saturate-[130%]`} type="button" aria-label="Закрыть уведомления" onClick={() => setOpen(false)} />
              <section className={`${styles.notificationSheet} glass-panel backdrop-blur-[28px] backdrop-saturate-[180%]`}>
                <div className={styles.sheetHandle} />
                <header className={styles.sheetHeader}>
                  <div>
                    <p>Центр событий</p>
                    <h2 id="notifications-title">Уведомления</h2>
                  </div>
                  <button type="button" aria-label="Закрыть" onClick={() => setOpen(false)}><X size={18} /></button>
                </header>
                <div className={styles.notificationList}>
                  {demoNotifications.map((notification) => {
                    const Icon = notificationIcons[notification.tone];
                    return (
                      <article key={notification.id} className={`${styles.notificationItem} glass-panel backdrop-blur-[16px] backdrop-saturate-[160%] ${notification.unread ? styles.unread : ""}`}>
                        <span className={`${styles.notificationIcon} ${styles[notification.tone]}`}><Icon size={17} /></span>
                        <div>
                          <div className={styles.notificationMeta}><h3>{notification.title}</h3><time>{notification.time}</time></div>
                          <p>{notification.text}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>,
            portalRoot,
          )
        : null}
    </>
  );
}
