"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, FileText, Globe, LockKeyhole, Mail, MapPin, Sparkles, Tag } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function BrandRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !city.trim() || !address.trim() || !category.trim()) {
      setError("Заполните обязательные поля бренда.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/brand/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, city, address, category, description, website }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(data?.error ?? "Не удалось зарегистрировать бренд. Попробуйте ещё раз.");
      return;
    }

    router.replace(routes.brand.dashboard);
  }

  return (
    <AuthShell caption="B2B-кабинет Челленджера">
      <AuthCard
        icon={<Sparkles size={26} />}
        title="Регистрация бренда"
        subtitle="Создайте профиль бренда и аккаунт владельца для корпоративного кабинета."
      >
        <form onSubmit={handleSubmit} noValidate>
          <AuthInput icon={<Building2 size={19} />} label="Название бренда" autoComplete="organization" placeholder="Например, Coffee Place" value={name} error={Boolean(error)} disabled={pending} onChange={(event) => { setName(event.target.value); setError(""); }} />
          <AuthInput icon={<Mail size={19} />} label="Email владельца" type="email" autoComplete="email" placeholder="owner@brand.ru" value={email} error={Boolean(error)} disabled={pending} onChange={(event) => { setEmail(event.target.value); setError(""); }} />
          <AuthInput icon={<LockKeyhole size={19} />} label="Пароль" type="password" autoComplete="new-password" placeholder="Придумайте пароль" value={password} error={Boolean(error)} disabled={pending} onChange={(event) => { setPassword(event.target.value); setError(""); }} />
          <AuthInput icon={<MapPin size={19} />} label="Город" autoComplete="address-level2" placeholder="Санкт-Петербург" value={city} error={Boolean(error)} disabled={pending} onChange={(event) => { setCity(event.target.value); setError(""); }} />
          <AuthInput icon={<MapPin size={19} />} label="Адрес или расположение" autoComplete="street-address" placeholder="Невский проспект, 24" value={address} error={Boolean(error)} disabled={pending} onChange={(event) => { setAddress(event.target.value); setError(""); }} />
          <AuthInput icon={<Tag size={19} />} label="Категория" placeholder="Кофейня, фитнес, десерты" value={category} error={Boolean(error)} disabled={pending} onChange={(event) => { setCategory(event.target.value); setError(""); }} />
          <AuthInput icon={<FileText size={19} />} label="Описание бренда" placeholder="Коротко о бренде, опционально" value={description} disabled={pending} onChange={(event) => setDescription(event.target.value)} />
          <AuthInput icon={<Globe size={19} />} label="Сайт" type="url" autoComplete="url" placeholder="https://brand.ru" value={website} disabled={pending} onChange={(event) => setWebsite(event.target.value)} />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.primary} type="submit" disabled={pending}>
            {pending ? "Создаём кабинет..." : "Создать кабинет бренда"}
          </button>
        </form>
        <Link className={styles.secondary} href={routes.brandAuth.login}>
          Уже есть кабинет? <strong>Войти</strong>
        </Link>
      </AuthCard>
    </AuthShell>
  );
}
