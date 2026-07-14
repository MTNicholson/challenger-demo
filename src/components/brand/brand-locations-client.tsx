"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MapPin, Plus, Settings, Users, X } from "lucide-react";
import { AddressAutocomplete, type AddressSuggestion } from "@/components/brand/address-autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBrandLocation } from "@/lib/brand-format";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";

type Mode = "STANDARD" | "EXTENDED" | "FLAGSHIP";
type Admin = { id: string; name: string; email: string; status: "ACTIVE" | "DISABLED" } | null;
export type BrandLocationItem = { id: string; name: string | null; city: string; address: string; fullAddress: string | null; lat: number | null; lng: number | null; geoProvider: string | null; geoPlaceId: string | null; description: string | null; isMain: boolean; mode: Mode; cabinetEnabled: boolean; locationAdmin: Admin; staffCount: number };

const labels: Record<Mode, string> = { STANDARD: "Standard", EXTENDED: "Extended", FLAGSHIP: "Flagship" };
const blank = { name: "", city: "", address: "", fullAddress: "", lat: null as number | null, lng: null as number | null, geoProvider: null as string | null, geoPlaceId: null as string | null, description: "", isMain: false, mode: "STANDARD" as Mode, locationAdminName: "", locationAdminEmail: "", locationAdminPassword: "", locationAdminPasswordConfirmation: "" };

export function BrandLocationsClient({ initialLocations }: { initialLocations: BrandLocationItem[] }) {
  const [locations, setLocations] = useState(initialLocations);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function selectAddress(suggestion: AddressSuggestion) {
    setForm((value) => ({ ...value, address: suggestion.value || suggestion.unrestrictedValue, fullAddress: suggestion.unrestrictedValue, lat: suggestion.lat, lng: suggestion.lng, geoProvider: suggestion.geoProvider, geoPlaceId: suggestion.geoPlaceId }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const response = await fetch("/api/brand/locations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json().catch(() => null) as { error?: string; location?: BrandLocationItem } | null;
    setSaving(false);
    if (!response.ok || !data?.location) { setMessage(data?.error ?? "Не удалось создать точку."); return; }
    setLocations((value) => [...value, { ...data.location!, locationAdmin: { id: "new", name: form.locationAdminName, email: form.locationAdminEmail, status: "ACTIVE" }, staffCount: 1 }]);
    setForm(blank); setOpen(false);
  }

  return <main className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-blue-700">Управление филиалами</p><h1 className="mt-1 text-3xl font-black">Точки</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Настраивайте режимы, кабинеты точек и доступы команды.</p></div><Button onClick={() => { setOpen(true); setMessage(""); }}><Plus className="h-4 w-4" />Добавить точку</Button></header>
    {open ? <Card className="p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Новая точка</h2><p className="mt-1 text-sm text-slate-500">Для новой точки обязательно назначить администратора кабинета.</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><form className="mt-5 grid gap-4 lg:grid-cols-2" onSubmit={submit}><input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Название точки" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} /><select required className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={form.city} onChange={(event) => setForm((value) => ({ ...value, city: event.target.value, address: "", fullAddress: "", lat: null, lng: null }))}><option value="">Выберите город</option>{RUSSIAN_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}</select><div className="lg:col-span-2"><AddressAutocomplete city={form.city} value={form.address} disabled={!form.city} onChange={(address) => setForm((value) => ({ ...value, address, fullAddress: "", lat: null, lng: null, geoProvider: null, geoPlaceId: null }))} onSelect={selectAddress} /></div><textarea className="rounded-xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" placeholder="Описание точки" value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} /><select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={form.mode} onChange={(event) => setForm((value) => ({ ...value, mode: event.target.value as Mode }))}>{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isMain} onChange={(event) => setForm((value) => ({ ...value, isMain: event.target.checked }))} />Основная точка</label><div className="border-t border-slate-200 pt-4 lg:col-span-2"><h3 className="font-black">Администратор точки</h3><p className="mt-1 text-xs text-slate-500">Пароль сохраняется только в виде bcrypt-хеша.</p></div><input required className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Имя администратора" value={form.locationAdminName} onChange={(event) => setForm((value) => ({ ...value, locationAdminName: event.target.value }))} /><input required type="email" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email администратора" value={form.locationAdminEmail} onChange={(event) => setForm((value) => ({ ...value, locationAdminEmail: event.target.value }))} /><input required type="password" minLength={6} className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Пароль" value={form.locationAdminPassword} onChange={(event) => setForm((value) => ({ ...value, locationAdminPassword: event.target.value }))} /><input required type="password" minLength={6} className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Повторите пароль" value={form.locationAdminPasswordConfirmation} onChange={(event) => setForm((value) => ({ ...value, locationAdminPasswordConfirmation: event.target.value }))} /><div className="lg:col-span-2"><Button type="submit" disabled={saving}>{saving ? "Создаём…" : "Создать точку"}</Button>{message ? <p className="mt-3 text-sm font-bold text-rose-700">{message}</p> : null}</div></form></Card> : null}
    <Card className="p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">Все точки</h2><Badge>{locations.length} точек</Badge></div><div className="space-y-3">{locations.map((location) => <article key={location.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-black">{location.name || "Точка бренда"}</h3><Badge variant={location.mode === "FLAGSHIP" ? "success" : location.mode === "EXTENDED" ? "warning" : "neutral"}>{labels[location.mode]}</Badge></div><p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin className="h-4 w-4 text-blue-600" />{location.fullAddress || formatBrandLocation(location.city, location.address)}</p><div className="mt-3 flex flex-wrap gap-2"><Badge variant={location.cabinetEnabled ? "success" : "warning"}>{location.cabinetEnabled ? "Кабинет активен" : "Кабинет отключён"}</Badge><Badge variant={location.locationAdmin ? "success" : "warning"}>{location.locationAdmin ? "Администратор назначен" : "Админ не назначен"}</Badge><Badge><Users className="mr-1 h-3.5 w-3.5" />Команда: {location.staffCount}</Badge></div></div><Link href={`/brand/locations/${location.id}`}><Button variant="secondary"><Settings className="h-4 w-4" />Настроить</Button></Link></article>)}{!locations.length ? <p className="py-10 text-center text-sm font-bold text-slate-500">Точек пока нет.</p> : null}</div></Card>
  </main>;
}
