"use client";

import Link from "next/link";
import { Camera, CheckCircle2, CircleAlert, Gift, Keyboard, LoaderCircle, QrCode, RotateCcw, ShieldCheck, StopCircle, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { routes } from "@/lib/routes";

type ScanResult = { ok: boolean; status: string; message?: string; tokenId?: string; shortCode?: string; expiresAt?: string; redeemedAt?: string | null; reward?: { title: string; description: string | null; type: string }; challenge?: { title: string }; brand?: { name: string }; user?: { displayName: string }; location?: { title: string; address: string } };

function statusTitle(status: string) {
  return ({ VALID: "Награда доступна", REDEEMED: "Награда выдана", EXPIRED: "QR-код истёк", ALREADY_REDEEMED: "Награда уже использована", WRONG_LOCATION: "Награда не относится к этой точке", NOT_FOUND: "Код не найден", CHALLENGE_NOT_COMPLETED: "Челлендж ещё не завершён", CANCELLED: "QR-код больше не действует", ERROR: "Ошибка проверки" } as Record<string, string>)[status] ?? "Ошибка проверки";
}

export function LocationScannerClient() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [code, setCode] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMessage, setCameraMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const stopCamera = useCallback(() => { controlsRef.current?.stop(); controlsRef.current = null; setCameraActive(false); }, []);
  useEffect(() => () => controlsRef.current?.stop(), []);

  const validateCode = useCallback(async (rawCode: string) => {
    const normalized = rawCode.trim();
    if (!normalized) return;
    setChecking(true); setResult(null);
    try {
      const response = await fetch("/api/location/scanner/validate", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ code: normalized }) });
      const payload = await response.json().catch(() => null) as ScanResult | null;
      setResult(payload ?? { ok: false, status: "ERROR", message: "Не удалось проверить QR-код." });
    } catch { setResult({ ok: false, status: "ERROR", message: "Не удалось проверить QR-код." }); }
    finally { setChecking(false); }
  }, []);

  async function startCamera() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { setCameraMessage("Камера доступна только через HTTPS или localhost. Используйте ручной код или откройте защищённую версию сайта."); return; }
    if (!videoRef.current) return;
    setCameraMessage("");
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromConstraints({ video: { facingMode: { ideal: "environment" } }, audio: false }, videoRef.current, (scan) => {
        if (!scan) return;
        const scannedCode = scan.getText(); setCode(scannedCode); stopCamera(); void validateCode(scannedCode);
      });
      controlsRef.current = controls; setCameraActive(true);
    } catch { stopCamera(); setCameraMessage("Камера недоступна. Введите ручной код с экрана пользователя."); }
  }

  async function redeem() {
    if (!result?.tokenId) return;
    setRedeeming(true);
    try {
      const response = await fetch("/api/location/scanner/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ tokenId: result.tokenId }) });
      const payload = await response.json().catch(() => null) as ScanResult | null;
      setResult(payload ?? { ok: false, status: "ERROR", message: "Не удалось подтвердить выдачу награды." });
    } catch { setResult({ ok: false, status: "ERROR", message: "Не удалось подтвердить выдачу награды." }); }
    finally { setRedeeming(false); }
  }

  function reset() { stopCamera(); setCode(""); setResult(null); setCameraMessage(""); }
  const valid = result?.ok && result.status === "VALID";
  const redeemed = result?.ok && result.status === "REDEEMED";

  return <div className="max-w-3xl space-y-6">
    <header><p className="text-sm font-bold text-blue-700">Выдача наград</p><h1 className="mt-1 text-3xl font-black">Сканер QR</h1><p className="mt-2 text-slate-500">Проверьте QR-код или введите короткий код вручную перед выдачей награды.</p></header>
    {!result ? <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative aspect-video bg-slate-950"><video ref={videoRef} className={`h-full w-full object-cover ${cameraActive ? "block" : "hidden"}`} muted playsInline/><div className={`absolute inset-0 grid place-items-center text-center text-slate-400 ${cameraActive ? "hidden" : ""}`}><div><QrCode className="mx-auto h-10 w-10"/><p className="mt-3 text-sm font-bold">Камера запускается только по кнопке</p></div></div></div><div className="flex flex-wrap gap-3 p-5"><button type="button" onClick={() => void startCamera()} disabled={cameraActive} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60"><Camera className="h-4 w-4"/>Открыть камеру</button><button type="button" onClick={stopCamera} disabled={!cameraActive} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-50"><StopCircle className="h-4 w-4"/>Остановить камеру</button></div>{cameraMessage ? <p className="mx-5 mb-5 rounded-xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">{cameraMessage}</p> : null}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Keyboard className="h-5 w-5 text-blue-600"/><h2 className="font-black">Ручной код</h2></div><p className="mt-1 text-sm text-slate-500">Введите код вида ABC-123 с экрана пользователя.</p><form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void validateCode(code); }}><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Например, A7K-42P" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 font-black uppercase tracking-[.14em] outline-none focus:border-blue-500"/><button disabled={!code.trim() || checking} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-60">{checking ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <ShieldCheck className="h-4 w-4"/>}Проверить код</button></form></section>
      <Link href={routes.location.scanLog} className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:underline">Открыть лог сканирований</Link>
    </> : <section className={`rounded-2xl border p-6 shadow-sm ${valid || redeemed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex items-start gap-3"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${valid || redeemed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>{valid || redeemed ? <CheckCircle2 className="h-6 w-6"/> : <CircleAlert className="h-6 w-6"/>}</span><div><p className="text-sm font-bold text-slate-500">Результат проверки</p><h2 className="text-xl font-black">{statusTitle(result.status)}</h2><p className="mt-1 text-sm text-slate-600">{result.message ?? (valid ? "Проверьте данные и подтвердите выдачу." : "")}</p></div></div>
      {(valid || redeemed) && result.reward ? <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2"><Info icon={<Gift className="h-4 w-4"/>} label="Награда" value={result.reward.title}/><Info icon={<UserRound className="h-4 w-4"/>} label="Пользователь" value={result.user?.displayName ?? "—"}/><Info label="Челлендж" value={result.challenge?.title ?? "—"}/><Info label="Код" value={result.shortCode ?? "—"}/><Info label="Точка" value={result.location?.title ?? "—"}/><Info label="Бренд" value={result.brand?.name ?? "—"}/></div> : null}
      <div className="mt-6 flex flex-wrap gap-3">{valid ? <button type="button" onClick={() => void redeem()} disabled={redeeming} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">{redeeming ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4"/>}Подтвердить выдачу</button> : null}<button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"><RotateCcw className="h-4 w-4"/>Сканировать другой код</button><Link href={routes.location.scanLog} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700">Лог сканирований</Link></div>
    </section>}
  </div>;
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl bg-white/80 p-3"><p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">{icon}{label}</p><p className="mt-1 font-black text-slate-800">{value}</p></div>; }
