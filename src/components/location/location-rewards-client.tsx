"use client";

import { useState } from "react";
import { Archive, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Reward = { id: string; title: string; type: string; description: string; limit: number | null; points: number; expiresInDays: number | null; usageTerms: string | null; issuedCount: number; redeemedCount: number };
type Form = { id?: string; title: string; type: string; description: string; limit: string; points: string; expiresInDays: string; usageTerms: string };
const blank = (): Form => ({ title: "", type: "gift", description: "", limit: "", points: "0", expiresInDays: "15", usageTerms: "" });

export function LocationRewardsClient({ initialRewards }: { initialRewards: Reward[] }) {
  const [rewards, setRewards] = useState(initialRewards);
  const [form, setForm] = useState<Form | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const update = (key: keyof Form, value: string) => setForm((current) => current ? { ...current, [key]: value } : current);

  async function save() {
    if (!form) return;
    const response = await fetch(form.id ? `/api/location/rewards/${form.id}` : "/api/location/rewards", {
      method: form.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, limit: form.limit ? Number(form.limit) : null, points: Number(form.points || 0), expiresInDays: form.expiresInDays ? Number(form.expiresInDays) : null }),
    });
    const data = await response.json().catch(() => null) as { reward?: Reward; error?: string } | null;
    if (!response.ok || !data?.reward) { setMessage(data?.error ?? "Не удалось сохранить награду."); return; }
    setRewards((items) => form.id ? items.map((item) => item.id === data.reward!.id ? data.reward! : item) : [data.reward!, ...items]);
    setForm(null); setMessage("Награда сохранена в локальном списке точки.");
  }
  async function archive(id: string) {
    const response = await fetch(`/api/location/rewards/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "archive" }) });
    if (response.ok) setRewards((items) => items.filter((item) => item.id !== id)); else setMessage("Не удалось архивировать награду.");
  }
  return <main className="mx-auto w-full max-w-[1280px] space-y-6 px-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">Награды точки</p><h1 className="text-3xl font-black">Локальный список наград</h1><p className="mt-2 text-sm text-slate-500">Награды этой точки. Их технический статус не отображается в кабинете точки.</p></div><Button onClick={() => { setMessage(null); setForm(blank()); }}><Plus className="h-4 w-4" />Создать награду</Button></header>{message ? <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">{message}</p> : null}<Card className="overflow-hidden p-0"><div className="divide-y divide-slate-100">{rewards.length ? rewards.map((reward) => <article key={reward.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-black text-slate-950">{reward.title}</h2><p className="mt-1 text-sm text-slate-500">{reward.description}</p><p className="mt-2 text-xs font-bold text-slate-400">Лимит: {reward.limit ?? "без лимита"} · Выдано: {reward.issuedCount} · Баллы: {reward.points}</p></div><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setForm({ id: reward.id, title: reward.title, type: reward.type, description: reward.description, limit: reward.limit?.toString() ?? "", points: reward.points.toString(), expiresInDays: reward.expiresInDays?.toString() ?? "", usageTerms: reward.usageTerms ?? "" })}><Pencil className="h-4 w-4" />Редактировать</Button><Button size="sm" variant="ghost" onClick={() => archive(reward.id)}><Archive className="h-4 w-4" />Архивировать</Button></div></article>) : <p className="p-10 text-center text-sm font-bold text-slate-400">Локальных наград пока нет.</p>}</div></Card>{form ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4"><Card className="w-full max-w-2xl p-6"><div className="flex justify-between gap-4"><h2 className="text-xl font-black">{form.id ? "Редактировать награду" : "Создать награду"}</h2><button onClick={() => setForm(null)}><X className="h-5 w-5" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><input className="brand-field h-12 rounded-xl px-4" placeholder="Название" value={form.title} onChange={(e) => update("title", e.target.value)} /><select className="brand-field h-12 rounded-xl px-4" value={form.type} onChange={(e) => update("type", e.target.value)}>{["gift","discount","bonus","service","access","coins","custom"].map((type) => <option key={type} value={type}>{type}</option>)}</select><textarea className="brand-field min-h-24 rounded-xl px-4 py-3 sm:col-span-2" placeholder="Описание" value={form.description} onChange={(e) => update("description", e.target.value)} /><input className="brand-field h-12 rounded-xl px-4" type="number" placeholder="Лимит" value={form.limit} onChange={(e) => update("limit", e.target.value)} /><input className="brand-field h-12 rounded-xl px-4" type="number" placeholder="Баллы" value={form.points} onChange={(e) => update("points", e.target.value)} /><textarea className="brand-field min-h-20 rounded-xl px-4 py-3 sm:col-span-2" placeholder="Условия использования" value={form.usageTerms} onChange={(e) => update("usageTerms", e.target.value)} /></div><div className="mt-5 flex justify-end gap-3"><Button variant="secondary" onClick={() => setForm(null)}>Отмена</Button><Button onClick={save}>Сохранить</Button></div></Card></div> : null}</main>;
}
