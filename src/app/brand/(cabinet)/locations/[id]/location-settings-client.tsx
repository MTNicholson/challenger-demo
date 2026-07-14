"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Plus, Power, Save, UserCog, Users } from "lucide-react";
import { AddressAutocomplete, type AddressSuggestion } from "@/components/brand/address-autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";

type Mode = "STANDARD" | "EXTENDED" | "FLAGSHIP";
type Role = "LOCATION_ADMIN" | "LOCATION_STAFF";
type Status = "ACTIVE" | "DISABLED";
type LocationUser = { id: string; name: string; email: string; role: Role; status: Status; createdAt: string; lastLoginAt: string | null };
type Location = { id: string; name: string | null; city: string; address: string; fullAddress: string | null; lat: number | null; lng: number | null; geoProvider: string | null; geoPlaceId: string | null; description: string | null; isMain: boolean; mode: Mode; cabinetEnabled: boolean; createdAt: string; updatedAt: string; users: LocationUser[] };

const modes: Record<Mode, { title: string; description: string; confirmation: string }> = {
  STANDARD: { title: "Standard", description: "Базовый режим. Точка может смотреть аналитику своей точки, управлять сотрудниками и использовать QR-сканер. Создание челленджей и наград недоступно.", confirmation: "Будут доступны только аналитика, сотрудники и сканер." },
  EXTENDED: { title: "Extended", description: "Расширенный режим. Точка получает все возможности Standard и сможет создавать предложения челленджей и локальные черновики наград. Публикация требует подтверждения основного кабинета бренда.", confirmation: "Добавятся разделы челленджей и наград как расширенные функции точки." },
  FLAGSHIP: { title: "Flagship", description: "Автономный режим. Точка получает все возможности Extended и в будущем сможет самостоятельно запускать челленджи только для своей точки. Основной кабинет бренда сможет расширить такой челлендж на другие точки. Автономия действует только в рамках этой точки.", confirmation: "Точка получит автономный режим только в рамках этой точки." },
};

function UserRow({ locationId, user, onUpdated }: { locationId: string; user: LocationUser; onUpdated: (user: LocationUser) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [notice, setNotice] = useState("");

  async function update(payload: Record<string, string>) {
    const response = await fetch(`/api/brand/locations/${locationId}/users/${user.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => null) as { error?: string; user?: LocationUser } | null;
    if (!response.ok || !data?.user) { setNotice(data?.error ?? "Не удалось обновить пользователя."); return; }
    onUpdated(data.user);
    setPassword(""); setConfirmation(""); setNotice("Изменения сохранены.");
  }

  return <div className="rounded-xl border border-slate-200 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-black">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p><p className="mt-1 text-xs font-bold text-slate-400">Создан: {new Date(user.createdAt).toLocaleDateString("ru-RU")} · Последняя активность: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("ru-RU") : "ещё не входил"}</p></div><div className="flex gap-2"><Badge variant={user.status === "ACTIVE" ? "success" : "warning"}>{user.status === "ACTIVE" ? "Активен" : "Отключён"}</Badge><Button size="sm" variant="secondary" onClick={() => setEditing((value) => !value)}>Управлять</Button></div></div>
    {editing ? <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2"><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя" /><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" /><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Новый пароль" /><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Повторите новый пароль" /><p className="text-xs font-bold text-slate-400 sm:col-span-2">Пароль нельзя посмотреть после создания. Можно задать новый пароль.</p><div className="flex flex-wrap gap-2 sm:col-span-2"><Button size="sm" onClick={() => update({ name, email, ...(password ? { password, passwordConfirmation: confirmation } : {}) })}>Сохранить</Button><Button size="sm" variant="ghost" onClick={() => update({ status: user.status === "ACTIVE" ? "DISABLED" : "ACTIVE" })}>{user.status === "ACTIVE" ? "Отключить" : "Включить"}</Button></div>{notice ? <p className="text-sm font-bold text-slate-600 sm:col-span-2">{notice}</p> : null}</div> : null}
  </div>;
}

export function LocationSettingsClient({ initialLocation }: { initialLocation: Location }) {
  const [location, setLocation] = useState(initialLocation);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [modeSaving, setModeSaving] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [admin, setAdmin] = useState({ name: "", email: "", password: "", confirmation: "" });
  const admins = location.users.filter((user) => user.role === "LOCATION_ADMIN");
  const staff = location.users.filter((user) => user.role === "LOCATION_STAFF");

  function updateLocation(patch: Partial<Location>) { setLocation((value) => ({ ...value, ...patch })); }
  function selectAddress(suggestion: AddressSuggestion) { updateLocation({ address: suggestion.value || suggestion.unrestrictedValue, fullAddress: suggestion.unrestrictedValue, lat: suggestion.lat, lng: suggestion.lng, geoProvider: suggestion.geoProvider, geoPlaceId: suggestion.geoPlaceId }); }
  async function requestSave(next: Location) {
    const response = await fetch(`/api/brand/locations/${next.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    const data = await response.json().catch(() => null) as { error?: string; location?: Location } | null;
    if (!response.ok || !data?.location) throw new Error(data?.error ?? "Не удалось сохранить точку.");
    setLocation((value) => ({ ...value, ...data.location }));
  }
  async function save(event: FormEvent) { event.preventDefault(); setSaving(true); try { await requestSave(location); setNotice("Настройки точки сохранены."); } catch (error) { setNotice(error instanceof Error ? error.message : "Не удалось сохранить точку."); } finally { setSaving(false); } }
  async function confirmMode() { if (!pendingMode) return; setModeSaving(true); try { await requestSave({ ...location, mode: pendingMode }); setNotice(`Режим точки изменён на ${modes[pendingMode].title}.`); setPendingMode(null); } catch (error) { setNotice(error instanceof Error ? error.message : "Не удалось изменить режим точки."); } finally { setModeSaving(false); } }
  async function createAdmin() { const response = await fetch(`/api/brand/locations/${location.id}/location-admin`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: admin.name, email: admin.email, password: admin.password, passwordConfirmation: admin.confirmation }) }); const data = await response.json().catch(() => null) as { error?: string; admin?: LocationUser } | null; if (!response.ok || !data?.admin) { setNotice(data?.error ?? "Не удалось создать администратора."); return; } setLocation((value) => ({ ...value, users: [...value.users, data.admin!] })); setAdminOpen(false); setAdmin({ name: "", email: "", password: "", confirmation: "" }); setNotice("Администратор точки создан."); }
  function replaceUser(user: LocationUser) { setLocation((value) => ({ ...value, users: value.users.map((item) => item.id === user.id ? user : item) })); }

  return <main className="space-y-6">
    <header className="flex flex-wrap items-center gap-3"><Link href="/brand/locations" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white"><ArrowLeft className="h-4 w-4" /></Link><div><div className="flex items-center gap-2"><h1 className="text-3xl font-black">{location.name || "Точка бренда"}</h1><Badge variant={location.mode === "FLAGSHIP" ? "success" : location.mode === "EXTENDED" ? "warning" : "neutral"}>{modes[location.mode].title}</Badge></div><p className="mt-1 text-sm font-bold text-slate-500">{location.cabinetEnabled ? "Кабинет точки активен" : "Кабинет точки отключён"}</p></div></header>
    <form onSubmit={save}><Card className="p-6"><h2 className="text-xl font-black">Основные данные точки</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Название" value={location.name ?? ""} onChange={(event) => updateLocation({ name: event.target.value })} /><select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={location.city} onChange={(event) => updateLocation({ city: event.target.value })}>{RUSSIAN_CITIES.map((city) => <option key={city}>{city}</option>)}</select><div className="md:col-span-2"><AddressAutocomplete city={location.city} value={location.address} onChange={(address) => updateLocation({ address, fullAddress: "", lat: null, lng: null, geoProvider: null, geoPlaceId: null })} onSelect={selectAddress} /></div><textarea className="rounded-xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" value={location.description ?? ""} onChange={(event) => updateLocation({ description: event.target.value })} placeholder="Описание" /><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={location.isMain} onChange={(event) => updateLocation({ isMain: event.target.checked })} />Основная точка</label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={location.cabinetEnabled} onChange={(event) => updateLocation({ cabinetEnabled: event.target.checked })} />{location.cabinetEnabled ? "Кабинет точки включён" : "Кабинет точки отключён"}</label></div><div className="mt-5"><Button type="submit" disabled={saving}><Save className="h-4 w-4" />{saving ? "Сохраняем…" : "Сохранить"}</Button>{notice ? <span className="ml-3 text-sm font-bold text-slate-600">{notice}</span> : null}</div></Card></form>
    <Card className="p-6"><h2 className="text-xl font-black">Режим точки</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{(Object.keys(modes) as Mode[]).map((mode) => <button type="button" key={mode} onClick={() => mode !== location.mode && setPendingMode(mode)} className={`rounded-2xl border p-4 text-left ${location.mode === mode ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}><p className="font-black">{modes[mode].title}</p><p className="mt-2 text-sm leading-6 text-slate-500">{modes[mode].description}</p></button>)}</div></Card>
    <section><div className="mb-3 flex items-center justify-between"><div><h2 className="text-xl font-black">Администраторы точки</h2><p className="mt-1 text-sm text-slate-500">Пароль нельзя посмотреть после создания. Можно задать новый пароль.</p></div><Button variant="secondary" onClick={() => setAdminOpen((value) => !value)}><Plus className="h-4 w-4" />Создать администратора точки</Button></div>{adminOpen ? <Card className="mb-3 p-5"><div className="grid gap-3 md:grid-cols-2"><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Имя" value={admin.name} onChange={(event) => setAdmin((value) => ({ ...value, name: event.target.value }))} /><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Email" value={admin.email} onChange={(event) => setAdmin((value) => ({ ...value, email: event.target.value }))} /><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="password" placeholder="Пароль" value={admin.password} onChange={(event) => setAdmin((value) => ({ ...value, password: event.target.value }))} /><input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="password" placeholder="Повторите пароль" value={admin.confirmation} onChange={(event) => setAdmin((value) => ({ ...value, confirmation: event.target.value }))} /></div><Button className="mt-4" onClick={createAdmin}>Создать</Button></Card> : null}<Card className="p-4">{admins.length ? admins.map((user) => <UserRow key={user.id} locationId={location.id} user={user} onUpdated={replaceUser} />) : <div className="py-6 text-center"><UserCog className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-black">Администратор точки не назначен</p></div>}</Card></section>
    <section><div className="mb-3"><h2 className="text-xl font-black">Сотрудники точки</h2><p className="mt-1 text-sm text-slate-500">Сотрудников добавляет администратор внутри кабинета точки.</p></div><Card className="p-4">{staff.length ? staff.map((user) => <UserRow key={user.id} locationId={location.id} user={user} onUpdated={replaceUser} />) : <div className="py-6 text-center"><Users className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-black">Сотрудники ещё не добавлены</p></div>}</Card></section>
    <div className="flex flex-wrap gap-3"><Link href="/brand/locations"><Button variant="ghost">Вернуться к списку</Button></Link><Button variant={location.cabinetEnabled ? "secondary" : "primary"} onClick={() => updateLocation({ cabinetEnabled: !location.cabinetEnabled })}><Power className="h-4 w-4" />{location.cabinetEnabled ? "Отключить кабинет" : "Включить кабинет"}</Button></div>
    {pendingMode ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><Card className="w-full max-w-md p-6 shadow-xl"><h2 className="text-xl font-black">Изменить режим точки?</h2><p className="mt-3 text-sm leading-6 text-slate-600">Вы уверены, что хотите поменять режим точки на {modes[pendingMode].title}?</p><p className="mt-2 text-sm font-bold text-slate-700">{modes[pendingMode].confirmation}</p><div className="mt-6 flex justify-end gap-3"><Button variant="secondary" disabled={modeSaving} onClick={() => setPendingMode(null)}>Отмена</Button><Button disabled={modeSaving} onClick={confirmMode}>{modeSaving ? "Изменяем…" : "Да, изменить режим"}</Button></div></Card></div> : null}
  </main>;
}
