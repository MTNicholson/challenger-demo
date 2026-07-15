"use client";

import { CheckCircle2, CircleAlert, LoaderCircle, RefreshCw, ScrollText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ScanLog = { id: string; createdAt: string; status: string; rewardTitle: string; challengeTitle: string; userName: string; staffName: string; shortCode: string; message: string };

const successStatuses = new Set(["REDEEMED", "VALIDATED"]);
const labels: Record<string, string> = { REDEEMED: "Награда выдана", VALIDATED: "Проверен", NOT_FOUND: "Не найден", EXPIRED: "Истёк", ALREADY_REDEEMED: "Уже использован", WRONG_LOCATION: "Другая точка", CHALLENGE_NOT_COMPLETED: "Не завершён", CANCELLED: "Отменён", ERROR: "Ошибка" };

export function LocationScanLogClient() {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "success" | "errors">("all");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/location/scan-log", { credentials: "include", cache: "no-store" });
      const payload = await response.json().catch(() => null) as { scans?: ScanLog[]; error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Не удалось загрузить лог.");
      setScans(payload?.scans ?? []);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить лог."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);

  const visible = scans.filter((scan) => filter === "all" || (filter === "success" ? successStatuses.has(scan.status) : !successStatuses.has(scan.status)));
  return <div className="space-y-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">История точки</p><h1 className="mt-1 text-3xl font-black">Лог сканирований</h1><p className="mt-2 text-slate-500">Проверки и подтверждённые выдачи только этой точки.</p></div><button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"><RefreshCw className="h-4 w-4"/>Обновить</button></header>
    <div className="flex flex-wrap gap-2">{([ ["all", "Все"], ["success", "Успешные"], ["errors", "Ошибки"] ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-xl px-4 py-2 text-sm font-black ${filter === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{label}</button>)}</div>
    {loading ? <div className="grid min-h-48 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500"><LoaderCircle className="h-7 w-7 animate-spin"/></div> : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-800">{error}</div> : visible.length ? <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[860px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{["Дата", "Статус", "Награда", "Челлендж", "Пользователь", "Сотрудник", "Код", "Сообщение"].map((item) => <th key={item} className="px-4 py-3 font-black">{item}</th>)}</tr></thead><tbody>{visible.map((scan) => { const success = successStatuses.has(scan.status); return <tr key={scan.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-4 font-bold text-slate-600">{new Date(scan.createdAt).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${success ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{success ? <CheckCircle2 className="h-3.5 w-3.5"/> : <CircleAlert className="h-3.5 w-3.5"/>}{labels[scan.status] ?? scan.status}</span></td><td className="px-4 py-4 font-black">{scan.rewardTitle}</td><td className="px-4 py-4 text-slate-600">{scan.challengeTitle}</td><td className="px-4 py-4">{scan.userName}</td><td className="px-4 py-4">{scan.staffName}</td><td className="px-4 py-4 font-mono font-bold">{scan.shortCode}</td><td className="px-4 py-4 text-slate-600">{scan.message}</td></tr>; })}</tbody></table></div> : <div className="grid min-h-60 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center"><div><ScrollText className="mx-auto h-9 w-9 text-blue-600"/><h2 className="mt-4 text-lg font-black">Пока нет сканирований</h2><p className="mt-2 text-sm text-slate-500">Здесь появится история проверок и выдач наград.</p></div></div>}</div>;
}
