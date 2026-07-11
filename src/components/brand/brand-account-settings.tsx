"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Message({ text, ok }: { text: string; ok: boolean }) { return <p className={ok ? "text-sm font-bold text-emerald-700" : "text-sm font-bold text-rose-600"}>{text}</p>; }

export function BrandAccountSettings({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail); const [password, setPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState<{ ok: boolean; text: string } | null>(null); const [passwordMessage, setPasswordMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState<"email" | "password" | null>(null);
  async function save(event: FormEvent<HTMLFormElement>, type: "email" | "password") {
    event.preventDefault(); setSaving(type);
    const response = await fetch("/api/brand/settings/account", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(type === "email" ? { email } : { password }) });
    const data = await response.json().catch(() => null) as { error?: string; email?: string } | null;
    setSaving(null);
    const setter = type === "email" ? setEmailMessage : setPasswordMessage;
    if (!response.ok) { setter({ ok: false, text: data?.error ?? "Не удалось сохранить изменения." }); return; }
    if (type === "email") { setEmail(data?.email ?? email); setter({ ok: true, text: "Email обновлён." }); }
    else { setPassword(""); setter({ ok: true, text: "Пароль обновлён." }); }
  }
  return <Card className="p-6"><div><h2 className="text-xl font-black">Данные для входа</h2><p className="mt-1 text-sm leading-6 text-slate-500">Email и пароль меняются отдельно. Для смены не нужно подтверждать текущий пароль.</p></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><form className="rounded-2xl border border-slate-200 bg-slate-50 p-4" onSubmit={(event) => save(event, "email")}><div className="flex items-center gap-2 font-black text-slate-900"><Mail className="h-4 w-4 text-blue-600" />Email</div><label className="mt-4 block text-sm font-bold text-slate-600">Новый email<input type="email" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-500" value={email} onChange={(event) => { setEmail(event.target.value); setEmailMessage(null); }} /></label><div className="mt-4 flex flex-wrap items-center gap-3"><Button type="submit" disabled={saving !== null}>{saving === "email" ? "Сохраняем..." : "Сменить email"}</Button>{emailMessage ? <Message {...emailMessage} /> : null}</div></form><form className="rounded-2xl border border-slate-200 bg-slate-50 p-4" onSubmit={(event) => save(event, "password")}><div className="flex items-center gap-2 font-black text-slate-900"><KeyRound className="h-4 w-4 text-blue-600" />Пароль</div><label className="mt-4 block text-sm font-bold text-slate-600">Новый пароль<input type="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-500" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordMessage(null); }} /></label><div className="mt-4 flex flex-wrap items-center gap-3"><Button type="submit" disabled={saving !== null}>{saving === "password" ? "Сохраняем..." : "Сменить пароль"}</Button>{passwordMessage ? <Message {...passwordMessage} /> : null}</div></form></div></Card>;
}
