"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { notifyAuthChanged } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !login.trim() || !password.trim()) {
      setError("Заполните все поля.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, identifier: login, password }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(data?.error ?? "Не удалось создать аккаунт. Попробуйте ещё раз.");
      return;
    }

    notifyAuthChanged();
    router.replace(routes.user.home);
  }

  return (
    <AuthShell>
      <AuthCard
        icon={<Sparkles size={26} />}
        title="Добро пожаловать в Челленджер"
        subtitle="Создайте аккаунт, чтобы открыть пользовательское приложение."
      >
        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            icon={<UserRound size={19} />}
            label="Имя"
            autoComplete="name"
            placeholder="Как вас зовут"
            value={name}
            error={Boolean(error)}
            disabled={pending}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
          />
          <AuthInput
            icon={<UserRound size={19} />}
            label="Email или телефон"
            autoComplete="username"
            placeholder="Email или телефон"
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
            autoComplete="new-password"
            placeholder="Придумайте пароль"
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
            {pending ? "Создаём аккаунт..." : "Создать аккаунт"}
          </button>
        </form>
        <Link className={styles.secondary} href={routes.auth.login}>
          Уже есть аккаунт? <strong>Войти</strong>
        </Link>
      </AuthCard>
    </AuthShell>
  );
}
