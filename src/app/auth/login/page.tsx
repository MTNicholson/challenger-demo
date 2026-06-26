"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LockKeyhole, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import { loginDemoUser } from "@/lib/demo-auth";
import styles from "@/components/auth/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!login.trim() || !password) { setError("Введите логин и пароль."); return; }
    const user = loginDemoUser(login, password);
    if (!user) { setError("Пользователь с таким логином и паролем не найден."); return; }
    router.replace(user.onboardingCompleted ? routes.user.home : routes.onboarding);
  }

  return (
    <AuthShell>
      <AuthCard icon={<KeyRound size={26} />} title="Вход в демо" subtitle="Войдите в свой демо-аккаунт, чтобы продолжить сценарий пользователя.">
        <form onSubmit={handleSubmit}>
          <AuthInput icon={<UserRound size={19} />} label="Логин" autoComplete="username" placeholder="Ваш логин" value={login} error={Boolean(error)} onChange={(event) => { setLogin(event.target.value); setError(""); }} />
          <AuthInput icon={<LockKeyhole size={19} />} label="Пароль" type="password" autoComplete="current-password" placeholder="Ваш пароль" value={password} error={Boolean(error)} onChange={(event) => { setPassword(event.target.value); setError(""); }} />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.primary} type="submit">Войти</button>
        </form>
        <Link className={styles.secondary} href={routes.auth.register}><strong>Создать демо-аккаунт</strong></Link>
      </AuthCard>
    </AuthShell>
  );
}
