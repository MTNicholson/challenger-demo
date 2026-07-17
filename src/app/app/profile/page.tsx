"use client";

import Link from "next/link";
import {
  Camera,
  ChevronRight,
  Gift,
  Heart,
  Headphones,
  MapPin,
  Pencil,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import { CoinBalanceCard } from "@/components/user/coin-balance-card";
import { routes } from "@/lib/routes";
import { notifyAuthChanged, useCurrentUser } from "@/lib/auth-client";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";
import styles from "@/components/user/profile-screen.module.css";

const menu = [
  { label: "Мои челленджи", description: "Активные и завершённые задания", icon: Trophy, href: `${routes.user.myChallenges}?from=profile`, tone: "mint" },
  { label: "Избранное", description: "Челленджи и бренды, которые вы сохранили", icon: Heart, href: routes.user.favorites, tone: "rose" },
  { label: "Мои награды", description: "Полученные награды и QR-коды", icon: Gift, href: routes.user.rewards, tone: "amber" },
] as const;

export default function UserProfilePage() {
  const { user } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isCityEditing, setIsCityEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [citySaving, setCitySaving] = useState(false);
  const [notice, setNotice] = useState("");
  const name = user?.name ?? "Алекс";
  const initials = name.slice(0, 1).toLocaleUpperCase();
  const city = user?.city ?? "Санкт-Петербург";

  function showSoon() {
    setNotice("Скоро появится");
    window.setTimeout(() => setNotice(""), 2000);
  }

  function openEditor() {
    setIsEditing(true);
  }

  function openCityEditor() {
    setSelectedCity(city);
    setIsCityEditing(true);
  }

  async function saveCity() {
    if (!selectedCity) return;
    setCitySaving(true);
    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ city: selectedCity }),
    });
    setCitySaving(false);

    if (!response.ok) {
      setNotice("Не удалось сохранить город");
      window.setTimeout(() => setNotice(""), 2000);
      return;
    }

    notifyAuthChanged();
    setIsCityEditing(false);
    setNotice("Город обновлён");
    window.setTimeout(() => setNotice(""), 2000);
  }

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <button type="button" className={styles.avatar} onClick={showSoon} aria-label="Изменить аватар">
          <span>{initials}</span>
          <i><Camera size={12} /></i>
        </button>
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h1>{name}</h1>
            <button type="button" onClick={openEditor} aria-label="Редактировать имя"><Pencil size={15} /></button>
          </div>
          <button type="button" className={styles.location} onClick={openCityEditor}>
            <MapPin size={14} />
            {city}
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      <CoinBalanceCard href={routes.user.coins} coins={user?.coinsBalance ?? 0} className={styles.balance} />

      <section className={styles.menu} aria-label="Разделы профиля">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} className={styles.menuItem} key={item.label}>
              <span className={styles[item.tone]}><Icon size={19} /></span>
              <div><strong>{item.label}</strong><small>{item.description}</small></div>
              <ChevronRight size={17} />
            </Link>
          );
        })}
        <button type="button" className={styles.menuItem} onClick={showSoon}>
          <span className={styles.lilac}><Settings size={19} /></span>
          <div><strong>Настройки</strong><small>Город, уведомления и доступы</small></div>
          <ChevronRight size={17} />
        </button>
        <button type="button" className={styles.menuItem} onClick={showSoon}>
          <span className={styles.blue}><Headphones size={19} /></span>
          <div><strong>Поддержка</strong><small>Помощь и вопросы</small></div>
          <ChevronRight size={17} />
        </button>
      </section>

      {notice ? <div className={styles.toast} role="status">{notice}</div> : null}

      {isEditing ? (
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsEditing(false)}>
          <section className={styles.editor} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={styles.close} onClick={() => setIsEditing(false)} aria-label="Закрыть"><X size={18} /></button>
            <h2>Редактирование профиля</h2>
            <p>Скоро здесь можно будет менять имя, город и аватар.</p>
            <button type="button" className={styles.saveButton} onClick={() => setIsEditing(false)}>Понятно</button>
          </section>
        </div>
      ) : null}

      {isCityEditing ? (
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsCityEditing(false)}>
          <section className={styles.editor} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={styles.close} onClick={() => setIsCityEditing(false)} aria-label="Закрыть"><X size={18} /></button>
            <h2>Выбор города</h2>
            <p>Город поможет показывать бренды и точки рядом с вами.</p>
            <select className={styles.select} value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
              <option value="">Выберите город</option>
              {RUSSIAN_CITIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <button type="button" className={styles.saveButton} disabled={citySaving || !selectedCity} onClick={saveCity}>
              {citySaving ? "Сохраняем..." : "Сохранить город"}
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
