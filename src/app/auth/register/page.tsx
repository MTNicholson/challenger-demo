"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Phone, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!phone.trim()) { setError(true); return; }
    setError(false);
    setSuccess(true);
    timer.current = setTimeout(() => router.push(routes.auth.login), 1100);
  }

  return (
    <AuthShell>
      <AuthCard icon={<Sparkles size={26} />} title="Добро пожаловать в Челленджер" subtitle="Введите номер телефона, чтобы открыть демо приложения.">
        <form onSubmit={handleSubmit} noValidate>
          <AuthInput icon={<Phone size={19} />} label="Номер телефона" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" value={phone} error={error} disabled={success} onChange={(event) => { setPhone(event.target.value); setError(false); }} />
          {error && <p className={styles.error} role="alert">Введите любой номер телефона, чтобы продолжить.</p>}
          {success && <div className={styles.success} role="status"><span className={styles.successIcon}><Check size={16} /></span>Регистрация успешна</div>}
          <button className={styles.primary} type="submit" disabled={success}>{success ? "Переходим ко входу…" : "Зарегистрироваться"}</button>
        </form>
        <Link className={styles.secondary} href={routes.auth.login}>Уже есть аккаунт? <strong>Войти</strong></Link>
      </AuthCard>
    </AuthShell>
  );
}
