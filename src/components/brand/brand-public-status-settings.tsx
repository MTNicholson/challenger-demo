"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PublicStatus = "OFFLINE" | "ONLINE";
type Readiness = { profile: boolean; logo: boolean; cover: boolean; location: boolean; challenge: boolean; reward: boolean };
type Props = { moderationStatus: string; initialPublicStatus: PublicStatus; readiness: Readiness };
const checklist: Array<[keyof Readiness, string]> = [["profile", "Профиль заполнен"], ["logo", "Добавлен логотип"], ["cover", "Добавлена обложка бренда"], ["location", "Есть хотя бы одна точка"], ["challenge", "Есть хотя бы один активный челлендж"], ["reward", "Есть хотя бы одна активная награда"]];

export function BrandPublicStatusSettings({ moderationStatus, initialPublicStatus, readiness }: Props) {
  const [publicStatus, setPublicStatus] = useState(initialPublicStatus);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const approved = moderationStatus === "approved";
  const online = publicStatus === "ONLINE";
  const nextStatus: PublicStatus = online ? "OFFLINE" : "ONLINE";
  async function updateStatus() { setSaving(true); const response = await fetch("/api/brand/settings/public-status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicStatus: nextStatus }) }); const data = await response.json().catch(() => null) as { error?: string; brand?: { publicStatus: PublicStatus } } | null; setSaving(false); if (!response.ok || !data?.brand) { setNotice(data?.error ?? "Не удалось изменить публичный статус бренда."); return; } setPublicStatus(data.brand.publicStatus); setConfirming(false); setNotice(nextStatus === "ONLINE" ? "Бренд запущен и теперь виден пользователям." : "Бренд скрыт из пользовательской части."); }
  return <Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black">Публичный статус бренда</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Этот статус не влияет на доступ в кабинет бренда и кабинеты точек.</p></div><Badge variant={online ? "success" : "warning"}>{online ? "Активен" : "Не активен"}</Badge></div>{!approved ? <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Публичный запуск будет доступен после подтверждения бренда администратором платформы.</div> : <><p className="mt-5 text-sm leading-6 text-slate-600">{online ? "Бренд виден пользователям. Пользовательская часть показывает бренд, точки и опубликованные челленджи." : "Бренд подтверждён, но пока скрыт от пользователей. Вы можете спокойно заполнить профиль, добавить точки, создать челленджи, награды и сотрудников точек. Пользовательская часть не показывает бренд, его точки и челленджи."}</p>{!online ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="flex items-center gap-2 text-sm font-black text-amber-900"><CircleAlert className="h-4 w-4" />{checklist.some(([key]) => !readiness[key]) ? "Бренд можно запустить, но некоторые данные ещё не заполнены." : "Бренд готов к публичному запуску."}</p><ul className="mt-3 grid gap-2 text-sm text-amber-900 sm:grid-cols-2">{checklist.map(([key, label]) => <li key={key} className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${readiness[key] ? "text-emerald-600" : "text-slate-400"}`} />{label}</li>)}</ul></div> : null}<Button className="mt-5" variant={online ? "secondary" : "primary"} onClick={() => setConfirming(true)}>{online ? "Снять с публикации" : "Запустить бренд"}</Button></>}{notice ? <p className="mt-3 text-sm font-bold text-emerald-700">{notice}</p> : null}{confirming ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><Card className="w-full max-w-md p-6 shadow-xl"><h3 className="text-xl font-black">{online ? "Скрыть бренд?" : "Запустить бренд?"}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{online ? "Бренд, его точки и челленджи перестанут отображаться в пользовательской части. Кабинет бренда, точки и сотрудники продолжат работать." : "После запуска пользователи смогут видеть бренд, его точки и опубликованные челленджи. Убедитесь, что профиль, визуалы, точки и активности готовы к показу."}</p><div className="mt-6 flex justify-end gap-3"><Button variant="secondary" disabled={saving} onClick={() => setConfirming(false)}>Отмена</Button><Button disabled={saving} onClick={updateStatus}>{saving ? "Сохраняем…" : online ? "Да, скрыть" : "Да, запустить"}</Button></div></Card></div> : null}</Card>;
}
