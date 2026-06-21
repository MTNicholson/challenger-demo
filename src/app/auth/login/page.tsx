"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LockKeyhole, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (login.trim() !== "admin" || password !== "admin") { setError(true); return; }
    localStorage.setItem("demoLoggedIn", "true");
    router.push(routes.onboarding);
  }

  return (
    <AuthShell>
      <AuthCard icon={<KeyRound size={26} />} title="Вход в демо" subtitle="Используйте тестовый аккаунт, чтобы пройти сценарий пользователя.">
        <form onSubmit={handleSubmit}>
          <AuthInput icon={<UserRound size={19} />} label="Логин" autoComplete="username" placeholder="admin" value={login} error={error} onChange={(event) => { setLogin(event.target.value); setError(false); }} />
          <AuthInput icon={<LockKeyhole size={19} />} label="Пароль" type="password" autoComplete="current-password" placeholder="admin" value={password} error={error} onChange={(event) => { setPassword(event.target.value); setError(false); }} />
          <p className={styles.helper}>Для демо: admin / admin</p>
          {error && <p className={styles.error} role="alert">Проверьте данные: для входа используйте admin / admin.</p>}
          <button className={styles.primary} type="submit">Войти</button>
        </form>
        <Link className={styles.secondary} href={routes.auth.register}><strong>Создать демо-аккаунт</strong></Link>
      </AuthCard>
    </AuthShell>
  );
}
