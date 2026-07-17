"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, KeyRound, LockKeyhole, LogOut, Mail, Store } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { routes } from "@/lib/routes";
import { AuthCard } from "./auth-card";
import { AuthInput } from "./auth-input";
import { AuthShell } from "./auth-shell";
import styles from "./auth.module.css";

export type LoginMode = "brand" | "location";
type BrandSession = { brand: { name: string } } | null;
type LocationSession = { user: { name: string; role: "LOCATION_ADMIN" | "LOCATION_STAFF" }; brand: { name: string }; location: { name: string | null } } | null;
type LoginResponse = { error?: string; redirectTo?: string };

export function BrandLoginClient({ initialMode, pendingNotice }: { initialMode: LoginMode; pendingNotice: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const [brandSession, setBrandSession] = useState<BrandSession>(null);
  const [locationSession, setLocationSession] = useState<LocationSession>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([
      fetch("/api/brand/auth/me", { credentials: "include" }).then(async (response) => response.ok ? await response.json() : null).catch(() => null),
      fetch("/api/location/auth/me", { credentials: "include" }).then(async (response) => response.ok ? await response.json() : null).catch(() => null),
    ]).then(([brand, location]) => {
      if (!active) return;
      setBrandSession(brand);
      setLocationSession(location);
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  const isLocation = mode === "location";
  const activeSession = isLocation ? locationSession : brandSession;

  function switchMode(nextMode: LoginMode) {
    setMode(nextMode);
    setError("");
    router.replace(`/brand/auth/login?mode=${nextMode}`, { scroll: false });
  }

  async function submitLogin(endpoint: "/api/brand/auth/login" | "/api/location/auth/login", fallback: string) {
    if (!email.trim() || !password.trim()) {
      setError("Введите логин и пароль.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: email.trim(), password, rememberMe }) });
      const data = await response.json().catch(() => null) as LoginResponse | null;
      if (!response.ok) { setError(data?.error ?? "Не удалось выполнить вход."); return; }
      router.replace(data?.redirectTo ?? fallback);
    } finally { setPending(false); }
  }

  async function handleBrandLogin(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await submitLogin("/api/brand/auth/login", routes.brand.dashboard); }
  async function handleLocationLogin(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await submitLogin("/api/location/auth/login", routes.location.scanner); }
  async function logout() { await fetch(isLocation ? "/api/location/auth/logout" : "/api/brand/auth/logout", { method: "POST", credentials: "include" }); if (isLocation) setLocationSession(null); else setBrandSession(null); }

  return <AuthShell caption="B2B-кабинет Челленджера"><AuthCard icon={isLocation ? <Store size={26} /> : <KeyRound size={26} />} title={isLocation ? "Вход в кабинет точки" : "Вход для бренда"} subtitle={isLocation ? "Для администраторов и сотрудников конкретной точки." : "Вход в основной кабинет компании."}>
    <div className="relative z-10 mt-1 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-black" role="tablist" aria-label="Тип кабинета">
      <button type="button" role="tab" aria-selected={!isLocation} onClick={() => switchMode("brand")} className={`min-h-11 touch-manipulation rounded-xl px-3 py-2.5 transition ${!isLocation ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Кабинет бренда</button>
      <button type="button" role="tab" aria-selected={isLocation} onClick={() => switchMode("location")} className={`min-h-11 touch-manipulation rounded-xl px-3 py-2.5 transition ${isLocation ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Кабинет точки</button>
    </div>
    {ready && activeSession ? <SessionState mode={mode} brandSession={brandSession} locationSession={locationSession} onLogout={logout} /> : <>
      <form onSubmit={isLocation ? handleLocationLogin : handleBrandLogin} className="relative z-10">
        <AuthInput icon={<Mail size={19} />} label={isLocation ? "Email администратора или сотрудника точки" : "Email"} type="email" autoComplete="username" placeholder={isLocation ? "Email администратора точки" : "Email владельца"} value={email} error={Boolean(error)} disabled={pending} onChange={(event) => { setEmail(event.target.value); setError(""); }} />
        <AuthInput icon={<LockKeyhole size={19} />} label="Пароль" type="password" autoComplete="current-password" placeholder="Ваш пароль" value={password} error={Boolean(error)} disabled={pending} onChange={(event) => { setPassword(event.target.value); setError(""); }} />
        <label className={styles.remember}><input type="checkbox" checked={rememberMe} disabled={pending} onChange={(event) => setRememberMe(event.target.checked)} /><span className={styles.rememberBox} /><span className={styles.rememberText}><strong>Запомнить меня</strong><small>Не выходить из кабинета на этом устройстве</small></span></label>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.primary} type="submit" disabled={pending}>{pending ? "Входим…" : isLocation ? "Войти в кабинет точки" : "Войти в кабинет"}</button>
        {pendingNotice && !isLocation && !error ? <p className={styles.helper}>Заявка бренда отправлена на проверку. После подтверждения вы сможете войти в кабинет.</p> : null}
      </form>
      {!isLocation ? <><Link className={styles.secondary} href={routes.brandAuth.forgotPassword}>Забыли пароль?</Link><Link className={styles.secondary} href={routes.brandAuth.register}><Building2 className="inline h-4 w-4 align-[-3px]" /> <strong>Зарегистрировать бренд</strong></Link></> : <p className={styles.helper}>Доступы для команды создаются в настройках конкретной точки.</p>}
    </>}
  </AuthCard></AuthShell>;
}

function SessionState({ mode, brandSession, locationSession, onLogout }: { mode: LoginMode; brandSession: BrandSession; locationSession: LocationSession; onLogout: () => Promise<void> }) {
  const router = useRouter();
  const isLocation = mode === "location";
  const locationRedirect = locationSession?.user.role === "LOCATION_ADMIN" ? routes.location.dashboard : routes.location.scanner;
  return <div className={styles.success}><span className={styles.successIcon}><CheckCircle2 size={16} /></span><div><strong>{isLocation ? "Вы уже залогинены в кабинет точки" : "Вы уже залогинены в кабинет бренда"}</strong><p className="mt-1 text-xs font-bold">{isLocation && locationSession ? `${locationSession.brand.name} · ${locationSession.location.name ?? "Точка"} · ${locationSession.user.role === "LOCATION_ADMIN" ? "администратор точки" : "сотрудник точки"}` : brandSession?.brand.name}</p><div className="mt-3 flex gap-3"><button type="button" className="font-black underline" onClick={() => router.push(isLocation ? locationRedirect : routes.brand.dashboard)}>{isLocation ? locationSession?.user.role === "LOCATION_ADMIN" ? "Войти в кабинет точки" : "Открыть сканер" : "Войти в кабинет"}</button><button type="button" className="font-black underline" onClick={() => void onLogout()}><LogOut className="mr-1 inline h-3.5 w-3.5" />Выйти</button></div></div></div>;
}
