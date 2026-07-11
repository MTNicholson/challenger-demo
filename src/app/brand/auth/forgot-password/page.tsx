"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, KeyRound, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { routes } from "@/lib/routes";
import styles from "@/components/auth/auth.module.css";

export default function ForgotBrandPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [brandName, setBrandName] = useState(""); const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function request(action: "verify" | "reset") {
    const response = await fetch("/api/brand/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, brandName, password, action }) });
    return { response, data: await response.json().catch(() => null) as { error?: string } | null };
  }
  async function verify(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); const { response, data } = await request("verify"); setPending(false); if (!response.ok) { setError(data?.error ?? "Не удалось подтвердить данные."); return; } setError(""); setVerified(true); }
  async function reset(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); const { response, data } = await request("reset"); setPending(false); if (!response.ok) { setError(data?.error ?? "Не удалось изменить пароль."); return; } router.replace(routes.brandAuth.login); }
  return <AuthShell caption="Восстановление доступа к кабинету бренда"><AuthCard icon={<KeyRound size={26} />} title="Восстановление пароля" subtitle={verified ? "Придумайте новый пароль для входа в кабинет." : "Укажите email владельца и точное название бренда."}>{verified ? <form onSubmit={reset}><AuthInput icon={<LockKeyhole size={19} />} label="Новый пароль" type="password" autoComplete="new-password" value={password} error={Boolean(error)} disabled={pending} onChange={(event) => { setPassword(event.target.value); setError(""); }} /><button className={styles.primary} type="submit" disabled={pending}>{pending ? "Сохраняем..." : "Сменить пароль"}</button>{error ? <p className={styles.error} role="alert">{error}</p> : null}</form> : <form onSubmit={verify}><AuthInput icon={<Mail size={19} />} label="Email" type="email" autoComplete="email" value={email} error={Boolean(error)} disabled={pending} onChange={(event) => { setEmail(event.target.value); setError(""); }} /><AuthInput icon={<Building2 size={19} />} label="Название бренда" type="text" value={brandName} error={Boolean(error)} disabled={pending} onChange={(event) => { setBrandName(event.target.value); setError(""); }} /><button className={styles.primary} type="submit" disabled={pending}>{pending ? "Проверяем..." : "Продолжить"}</button>{error ? <p className={styles.error} role="alert">{error}</p> : null}</form>}<Link className={styles.secondary} href={routes.brandAuth.login}><ArrowLeft className="inline h-4 w-4 align-[-3px]" /> Вернуться ко входу</Link></AuthCard></AuthShell>;
}
