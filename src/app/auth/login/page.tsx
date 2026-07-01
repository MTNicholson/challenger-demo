"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LockKeyhole, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { notifyAuthChanged } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!login.trim() || !password.trim()) {
      setError("Введите email/телефон и пароль.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier: login, password }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(data?.error ?? "Не удалось войти. Проверьте данные и попробуйте снова.");
      return;
    }

    notifyAuthChanged();
    router.replace(routes.user.home);
  }

  return (
    <AuthShell>
      <AuthCard
        icon={<KeyRound size={26} />}
        title="Вход в Челленджер"
        subtitle="Войдите в аккаунт, чтобы продолжить пользовательский сценарий."
      >
        <form onSubmit={handleSubmit}>
          <AuthInput
            icon={<UserRound size={19} />}
            label="Email или телефон"
            autoComplete="username"
            placeholder="Ваш email или телефон"
            value={login}
            error={Boolean(error)}
            disabled={pending}
            onChange={(event) => {
              setLogin(event.target.value);
              setError("");
            }}
          />
          <AuthInput
            icon={<LockKeyhole size={19} />}
            label="Пароль"
            type="password"
            autoComplete="current-password"
            placeholder="Ваш пароль"
            value={password}
            error={Boolean(error)}
            disabled={pending}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button className={styles.primary} type="submit" disabled={pending}>
            {pending ? "Входим..." : "Войти"}
          </button>
        </form>
        <Link className={styles.secondary} href={routes.auth.register}>
          <strong>Создать аккаунт</strong>
        </Link>
      </AuthCard>
    </AuthShell>
  );
}
