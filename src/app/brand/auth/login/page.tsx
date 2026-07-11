"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, KeyRound, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function BrandLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Введите email и пароль.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/brand/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(data?.error ?? "Не удалось войти в кабинет бренда. Проверьте данные и попробуйте снова.");
      return;
    }

    router.replace(routes.brand.dashboard);
  }

  return (
    <AuthShell caption="B2B-кабинет Челленджера">
      <AuthCard
        icon={<KeyRound size={26} />}
        title="Вход для бренда"
        subtitle="Войдите в корпоративный кабинет, чтобы управлять челленджами и наградами."
      >
        <form onSubmit={handleSubmit}>
          <AuthInput icon={<Mail size={19} />} label="Email" type="email" autoComplete="username" placeholder="Email владельца" value={email} error={Boolean(error)} disabled={pending} onChange={(event) => { setEmail(event.target.value); setError(""); }} />
          <AuthInput icon={<LockKeyhole size={19} />} label="Пароль" type="password" autoComplete="current-password" placeholder="Ваш пароль" value={password} error={Boolean(error)} disabled={pending} onChange={(event) => { setPassword(event.target.value); setError(""); }} />
          <label className={styles.remember}>
            <input type="checkbox" checked={rememberMe} disabled={pending} onChange={(event) => setRememberMe(event.target.checked)} />
            <span className={styles.rememberBox} aria-hidden="true" />
            <span className={styles.rememberText}>
              <strong>Запомнить меня</strong>
              <small>Не выходить из кабинета бренда на этом устройстве</small>
            </span>
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.primary} type="submit" disabled={pending}>
            {pending ? "Входим..." : "Войти в кабинет"}
          </button>
        </form>
        <Link className={styles.secondary} href={routes.brandAuth.forgotPassword}>
          Забыли пароль?
        </Link>
        <Link className={styles.secondary} href={routes.brandAuth.register}>
          <Building2 className="inline h-4 w-4 align-[-3px]" /> <strong>Зарегистрировать бренд</strong>
        </Link>
      </AuthCard>
    </AuthShell>
  );
}
