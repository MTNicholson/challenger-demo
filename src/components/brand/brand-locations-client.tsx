"use client";

import { useState, type FormEvent } from "react";
import { Check, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { formatBrandLocation } from "@/lib/brand-format";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressAutocomplete, type AddressSuggestion } from "@/components/brand/address-autocomplete";

export type BrandLocationItem = {
  id: string;
  name: string | null;
  city: string;
  address: string;
  fullAddress: string | null;
  lat: number | null;
  lng: number | null;
  geoProvider: string | null;
  geoPlaceId: string | null;
  description: string | null;
  isMain: boolean;
};

type LocationFormState = Omit<BrandLocationItem, "id" | "name" | "fullAddress" | "description"> & {
  name: string;
  fullAddress: string;
  description: string;
};

const emptyLocationForm: LocationFormState = {
  name: "", city: "", address: "", fullAddress: "", lat: null, lng: null,
  geoProvider: null, geoPlaceId: null, description: "", isMain: false,
};

function Status({ ok, text }: { ok: boolean; text: string }) {
  return <div className={ok ? "rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700" : "rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600"}>{text}</div>;
}

export function BrandLocationsClient({ initialLocations }: { initialLocations: BrandLocationItem[] }) {
  const [locations, setLocations] = useState(initialLocations);
  const [form, setForm] = useState<LocationFormState>(emptyLocationForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const resetForm = () => { setEditingId(null); setForm(emptyLocationForm); };
  const refresh = async () => {
    const response = await fetch("/api/brand/locations");
    const data = await response.json().catch(() => null) as { locations?: BrandLocationItem[] } | null;
    if (response.ok && data?.locations) setLocations(data.locations);
  };
  const resetAddress = (address: string) => setForm((value) => ({ ...value, address, fullAddress: "", lat: null, lng: null, geoProvider: null, geoPlaceId: null }));
  const selectAddress = (suggestion: AddressSuggestion) => setForm((value) => ({
    ...value, address: suggestion.value || suggestion.unrestrictedValue, fullAddress: suggestion.unrestrictedValue,
    lat: suggestion.lat, lng: suggestion.lng, geoProvider: suggestion.geoProvider, geoPlaceId: suggestion.geoPlaceId,
  }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(editingId ? `/api/brand/locations/${editingId}` : "/api/brand/locations", {
      method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => null) as { error?: string } | null;
    setSaving(false);
    if (!response.ok) { setMessage({ ok: false, text: data?.error ?? "Не удалось сохранить точку." }); return; }
    setMessage({ ok: true, text: editingId ? "Точка обновлена." : "Точка добавлена." });
    resetForm();
    await refresh();
  }

  async function remove(location: BrandLocationItem) {
    if (!window.confirm(`Удалить точку «${location.name || formatBrandLocation(location.city, location.address)}»?`)) return;
    const response = await fetch(`/api/brand/locations/${location.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) { setMessage({ ok: false, text: data?.error ?? "Не удалось удалить точку." }); return; }
    setMessage({ ok: true, text: "Точка удалена." });
    if (editingId === location.id) resetForm();
    await refresh();
  }

  function edit(location: BrandLocationItem) {
    setEditingId(location.id);
    setForm({ name: location.name ?? "", city: location.city, address: location.address, fullAddress: location.fullAddress ?? "", lat: location.lat, lng: location.lng, geoProvider: location.geoProvider, geoPlaceId: location.geoPlaceId, description: location.description ?? "", isMain: location.isMain });
    setMessage(null);
  }

  return <main className="space-y-6">
    <header><div className="text-sm font-bold text-blue-700">Управление филиалами</div><h1 className="mt-1 text-3xl font-black tracking-tight">Точки бренда</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Добавляйте, редактируйте и удаляйте точки, в которых доступны ваши челленджи.</p></header>
    <Card className="p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-black">Все точки</h2><p className="mt-1 text-sm text-slate-500">Основную точку можно не выбирать.</p></div><Badge>{locations.length ? `${locations.length} точек` : "Точек пока нет"}</Badge></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">{locations.length ? locations.map((location) => <div key={location.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-black">{location.name || "Точка бренда"}</h3>{location.isMain ? <Badge variant="success">Основная</Badge> : null}</div><div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin className="h-4 w-4 text-blue-600" />{location.fullAddress || formatBrandLocation(location.city, location.address)}</div><div className="mt-2">{location.lat !== null && location.lng !== null ? <Badge variant="success">Адрес подтверждён</Badge> : <Badge variant="warning">Без координат</Badge>}</div>{location.description ? <p className="mt-2 text-sm leading-6 text-slate-500">{location.description}</p> : null}</div><div className="flex gap-2"><Button size="sm" variant="secondary" type="button" onClick={() => edit(location)}><Pencil className="h-4 w-4" />Редактировать</Button><Button size="sm" variant="ghost" type="button" onClick={() => remove(location)}><Trash2 className="h-4 w-4" />Удалить</Button></div></div></div>) : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Plus className="h-5 w-5" /></div><h3 className="mt-4 font-black">Добавьте первую точку бренда</h3><p className="mt-1 text-sm text-slate-500">Она появится в карточке бренда и при выборе точек для челленджа.</p></div>}</div>
        <form className="self-start rounded-2xl border border-slate-200 bg-slate-50 p-4" onSubmit={submit}><h3 className="font-black">{editingId ? "Редактировать точку" : "Добавить точку"}</h3><div className="mt-4 space-y-3"><input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" placeholder="Название точки, опционально" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} /><select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" value={form.city} onChange={(event) => setForm((value) => ({ ...value, city: event.target.value, address: "", fullAddress: "", lat: null, lng: null, geoProvider: null, geoPlaceId: null }))}><option value="">Выберите город</option>{RUSSIAN_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}</select><AddressAutocomplete city={form.city} value={form.address} disabled={!form.city} onChange={resetAddress} onSelect={selectAddress} />{form.address ? form.lat !== null && form.lng !== null ? <Badge variant="success">Адрес подтверждён</Badge> : <Badge variant="warning">Адрес не подтверждён на карте</Badge> : null}<textarea className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" placeholder="Описание, опционально" value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} /><label className="flex items-center gap-2 text-sm font-extrabold text-slate-700"><input type="checkbox" checked={form.isMain} onChange={(event) => setForm((value) => ({ ...value, isMain: event.target.checked }))} />Основная точка</label><p className="text-xs font-bold leading-5 text-slate-400">Если включить этот пункт, остальные точки перестанут быть основными.</p></div><div className="mt-4 flex flex-wrap gap-2"><Button type="submit" disabled={saving}><Check className="h-4 w-4" />{saving ? "Сохраняем..." : "Сохранить точку"}</Button>{editingId ? <Button type="button" variant="ghost" onClick={resetForm}>Отмена</Button> : null}</div>{message ? <div className="mt-3"><Status {...message} /></div> : null}</form>
      </div>
    </Card>
  </main>;
}
