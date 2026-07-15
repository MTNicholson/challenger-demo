"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, CheckCircle2, Clock3, RefreshCw, Ticket, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { routes } from "@/lib/routes";
import styles from "./reward-qr-screen.module.css";

type RewardQrData = {
  qrPayload: string;
  shortCode: string;
  expiresAt: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED" | "CANCELLED";
  reward: { id: string | null; title: string; description: string | null };
  challenge: { id: string; title: string };
  brand: { id: string; name: string; logoUrl: string | null };
  location: { id: string; title: string; address: string } | null;
};

type RewardQrError = { error?: string; code?: string };

function formatRemaining(expiresAt: string) {
  const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return { remaining, label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` };
}

export function RewardQrScreen({ challengeId }: { challengeId: string }) {
  const [data, setData] = useState<RewardQrData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [redeemed, setRedeemed] = useState(false);

  const loadToken = useCallback(async (forceRefresh = false) => {
    setError(null);
    setRedeemed(false);
    if (forceRefresh) setRefreshing(true); else setLoading(true);
    try {
      const response = await fetch("/api/app/rewards/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challengeId, forceRefresh }),
      });
      const payload = await response.json().catch(() => null) as (RewardQrData & RewardQrError) | null;
      if (!response.ok || !payload) {
        if (payload?.code === "REDEEMED") { setRedeemed(true); return; }
        throw new Error(payload?.error ?? "Не удалось создать QR-код. Попробуйте ещё раз.");
      }
      setData(payload);
      setRemaining(formatRemaining(payload.expiresAt).remaining);
    } catch (requestError) {
      setData(null);
      setError(requestError instanceof Error ? requestError.message : "Не удалось создать QR-код. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [challengeId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadToken(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadToken]);

  useEffect(() => {
    if (!data) return;
    const update = () => setRemaining(formatRemaining(data.expiresAt).remaining);
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [data]);

  const expired = remaining === 0;
  const countdown = data ? formatRemaining(data.expiresAt).label : "";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={routes.user.challengeDetail(challengeId)} className={styles.back} aria-label="Назад"><ArrowLeft size={19} /></Link>
        <div><small>Ваша награда</small><h1>QR-код награды</h1></div>
      </header>

      {loading ? <section className={styles.state}><RefreshCw className={styles.spin} size={28} /><h2>Готовим QR-код...</h2></section> : null}
      {error ? <section className={styles.state}><TriangleAlert size={30} /><h2>{error}</h2><button type="button" onClick={() => void loadToken()}>Попробовать ещё раз</button></section> : null}
      {redeemed ? <section className={styles.state}><CheckCircle2 size={32} /><h2>Награда уже использована</h2><p>Эта награда уже была подтверждена сотрудником точки.</p><Link href={routes.user.challengeDetail(challengeId)}>Вернуться к челленджу</Link></section> : null}

      {data && !redeemed ? <section className={styles.card}>
        <div className={styles.available}><CheckCircle2 size={17} />Награда доступна</div>
        <span className={styles.icon}><Ticket size={28} /></span>
        <p className={styles.brand}>{data.brand.name}</p>
        <h2>{data.reward.title}</h2>
        <p className={styles.challenge}>За челлендж «{data.challenge.title}»</p>

        <div className={styles.qrFrame} aria-label={`QR-код награды ${data.shortCode}`}>
          <QRCodeSVG value={data.qrPayload} size={224} level="M" includeMargin />
        </div>
        <p className={styles.manualLabel}>Ручной код</p>
        <strong className={styles.shortCode}>{data.shortCode}</strong>

        <div className={styles.expiry} data-expired={expired || undefined}><Clock3 size={17} /><span>{expired ? "QR-код истёк" : `Действует ещё ${countdown}`}</span></div>
        <p className={styles.ttl}>QR действует 60 минут</p>

        {data.location ? <div className={styles.location}><small>Точка получения</small><b>{data.location.title}</b><p>{data.location.address}</p></div> : <div className={styles.location}><small>Точки получения</small><b>Доступные точки бренда</b><p>Уточните условия у сотрудника точки.</p></div>}
        {data.reward.description ? <div className={styles.rules}><small>Условия использования</small><p>{data.reward.description}</p></div> : null}

        <button type="button" className={styles.refresh} onClick={() => void loadToken(true)} disabled={refreshing}>{refreshing ? "Обновляем..." : "Обновить QR"}</button>
        <p className={styles.instruction}>Покажите этот QR-код сотруднику точки. После подтверждения награда будет считаться использованной.</p>
      </section> : null}
    </main>
  );
}
