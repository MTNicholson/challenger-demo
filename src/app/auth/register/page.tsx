"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, LockKeyhole, Sparkles, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import { registerDemoUser } from "@/lib/demo-auth";
import styles from "@/components/auth/auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = registerDemoUser({ name, login, password });
    if (!result.ok) { setError(result.error); return; }
    setError("");
    setSuccess(true);
    timer.current = setTimeout(() => router.push(routes.auth.login), 1100);
  }

  return (
    <AuthShell>
      <AuthCard icon={<Sparkles size={26} />} title="Добро пожаловать в Челленджер" subtitle="Создайте локальный демо-аккаунт, чтобы открыть приложение.">
        <form onSubmit={handleSubmit} noValidate>
          <AuthInput icon={<UserRound size={19} />} label="Имя" autoComplete="name" placeholder="Как вас зовут" value={name} error={Boolean(error)} disabled={success} onChange={(event) => { setName(event.target.value); setError(""); }} />
          <AuthInput icon={<UserRound size={19} />} label="Логин" autoComplete="username" placeholder="Придумайте логин" value={login} error={Boolean(error)} disabled={success} onChange={(event) => { setLogin(event.target.value); setError(""); }} />
          <AuthInput icon={<LockKeyhole size={19} />} label="Пароль" type="password" autoComplete="new-password" placeholder="Придумайте пароль" value={password} error={Boolean(error)} disabled={success} onChange={(event) => { setPassword(event.target.value); setError(""); }} />
          {error && <p className={styles.error} role="alert">{error}</p>}
          {success && <div className={styles.success} role="status"><span className={styles.successIcon}><Check size={16} /></span>Демо-аккаунт создан</div>}
          <button className={styles.primary} type="submit" disabled={success}>{success ? "Переходим ко входу…" : "Создать демо-аккаунт"}</button>
        </form>
        <Link className={styles.secondary} href={routes.auth.login}>Уже есть аккаунт? <strong>Войти</strong></Link>
      </AuthCard>
    </AuthShell>
  );
}
