"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, MapPin, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { BRAND_CATEGORIES, getBrandCategoryFallback } from "@/lib/brand-visuals";
import { formatBrandLocation } from "@/lib/brand-format";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressAutocomplete, type AddressSuggestion } from "@/components/brand/address-autocomplete";

type BrandSettingsBrand = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
};

type BrandLocationItem = {
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

type LocationFormState = {
  name: string;
  city: string;
  address: string;
  fullAddress: string;
  lat: number | null;
  lng: number | null;
  geoProvider: string | null;
  geoPlaceId: string | null;
  description: string;
  isMain: boolean;
};

type BrandSettingsClientProps = {
  brand: BrandSettingsBrand;
  locations: BrandLocationItem[];
};

const emptyLocationForm: LocationFormState = {
  name: "",
  city: "",
  address: "",
  fullAddress: "",
  lat: null,
  lng: null,
  geoProvider: null,
  geoPlaceId: null,
  description: "",
  isMain: false,
};

function readFilePreview(file: File, callback: (value: string | null) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    callback(typeof reader.result === "string" ? reader.result : null);
  });
  reader.readAsDataURL(file);
}

function statusText(ok: boolean, text: string) {
  return (
    <div className={ok ? "rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700" : "rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600"}>
      {text}
    </div>
  );
}

export function BrandSettingsClient({ brand, locations: initialLocations }: BrandSettingsClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: brand.name,
    category: brand.category ?? "",
    city: brand.city ?? "",
    address: brand.address ?? "",
    description: brand.description ?? "",
    website: brand.website ?? "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [locations, setLocations] = useState(initialLocations);
  const [locationForm, setLocationForm] = useState<LocationFormState>(emptyLocationForm);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingVisuals, setSavingVisuals] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [visualsMessage, setVisualsMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [locationMessage, setLocationMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fallback = useMemo(() => getBrandCategoryFallback(profile.category), [profile.category]);
  const logoSource = logoPreview ?? brand.logoUrl;
  const coverSource = coverPreview ?? brand.coverImageUrl;

  function updateProfile(key: keyof typeof profile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
    setProfileMessage(null);
  }

  function handleImageChange(kind: "logo" | "cover") {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      if (kind === "logo") {
        setLogoFile(file);
        if (file) readFilePreview(file, setLogoPreview);
        else setLogoPreview(null);
      } else {
        setCoverFile(file);
        if (file) readFilePreview(file, setCoverPreview);
        else setCoverPreview(null);
      }
      setVisualsMessage(null);
    };
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    const response = await fetch("/api/brand/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setSavingProfile(false);

    if (!response.ok) {
      setProfileMessage({ ok: false, text: data?.error ?? "Не удалось сохранить профиль." });
      return;
    }

    setProfileMessage({ ok: true, text: "Профиль бренда обновлён." });
    router.refresh();
  }

  async function submitVisuals(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!logoFile && !coverFile) {
      setVisualsMessage({ ok: false, text: "Выберите новый логотип или промо-картинку." });
      return;
    }

    const formData = new FormData();
    if (logoFile) formData.set("logo", logoFile);
    if (coverFile) formData.set("coverImage", coverFile);

    setSavingVisuals(true);
    const response = await fetch("/api/brand/settings/visuals", { method: "PATCH", body: formData });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setSavingVisuals(false);

    if (!response.ok) {
      setVisualsMessage({ ok: false, text: data?.error ?? "Не удалось обновить визуалы." });
      return;
    }

    setLogoFile(null);
    setCoverFile(null);
    setVisualsMessage({ ok: true, text: "Визуалы бренда обновлены." });
    router.refresh();
  }

  function startEditLocation(location: BrandLocationItem) {
    setEditingLocationId(location.id);
    setLocationForm({
      name: location.name ?? "",
      city: location.city,
      address: location.address,
      fullAddress: location.fullAddress ?? "",
      lat: location.lat,
      lng: location.lng,
      geoProvider: location.geoProvider,
      geoPlaceId: location.geoPlaceId,
      description: location.description ?? "",
      isMain: location.isMain,
    });
    setLocationMessage(null);
  }

  function updateLocationAddress(value: string) {
    setLocationForm((current) => ({
      ...current,
      address: value,
      fullAddress: "",
      lat: null,
      lng: null,
      geoProvider: null,
      geoPlaceId: null,
    }));
    setLocationMessage(null);
  }

  function selectLocationAddress(suggestion: AddressSuggestion) {
    setLocationForm((current) => ({
      ...current,
      address: suggestion.value || suggestion.unrestrictedValue,
      fullAddress: suggestion.unrestrictedValue,
      lat: suggestion.lat,
      lng: suggestion.lng,
      geoProvider: suggestion.geoProvider,
      geoPlaceId: suggestion.geoPlaceId,
    }));
    setLocationMessage(null);
  }

  function resetLocationForm() {
    setEditingLocationId(null);
    setLocationForm(emptyLocationForm);
  }

  async function refreshLocations() {
    const response = await fetch("/api/brand/locations");
    const data = (await response.json().catch(() => null)) as { locations?: BrandLocationItem[] } | null;
    if (response.ok && data?.locations) setLocations(data.locations);
  }

  async function submitLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingLocation(true);
    const response = await fetch(editingLocationId ? `/api/brand/locations/${editingLocationId}` : "/api/brand/locations", {
      method: editingLocationId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(locationForm),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setSavingLocation(false);

    if (!response.ok) {
      setLocationMessage({ ok: false, text: data?.error ?? "Не удалось сохранить точку." });
      return;
    }

    setLocationMessage({ ok: true, text: editingLocationId ? "Точка обновлена." : "Точка добавлена." });
    resetLocationForm();
    await refreshLocations();
  }

  async function deleteLocation(location: BrandLocationItem) {
    if (!window.confirm(`Удалить точку "${location.name || formatBrandLocation(location.city, location.address)}"?`)) return;
    const response = await fetch(`/api/brand/locations/${location.id}`, { method: "DELETE" });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setLocationMessage({ ok: false, text: data?.error ?? "Не удалось удалить точку." });
      return;
    }

    setLocationMessage({ ok: true, text: "Точка удалена." });
    await refreshLocations();
  }

  return (
    <main className="space-y-6">
      <header>
        <div className="text-sm font-bold text-blue-700">Профиль компании</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Настройки бренда</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Обновляйте профиль, визуалы и точки бренда</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <Card className="p-6">
          <h2 className="text-xl font-black">Профиль бренда</h2>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submitProfile}>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Название бренда
              <input className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.name} onChange={(event) => updateProfile("name", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Категория
              <select className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.category} onChange={(event) => updateProfile("category", event.target.value)}>
                <option value="">Выберите категорию</option>
                {BRAND_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Город основного присутствия
              <select className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.city} onChange={(event) => updateProfile("city", event.target.value)}>
                <option value="">Выберите город</option>
                {RUSSIAN_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Основной адрес
              <input className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.address} onChange={(event) => updateProfile("address", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600 md:col-span-2">
              Сайт
              <input className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.website} onChange={(event) => updateProfile("website", event.target.value)} placeholder="https://brand.ru" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600 md:col-span-2">
              Описание
              <textarea className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-500" value={profile.description} onChange={(event) => updateProfile("description", event.target.value)} />
            </label>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <Button type="submit" disabled={savingProfile}><Save className="h-4 w-4" />{savingProfile ? "Сохраняем..." : "Сохранить профиль"}</Button>
              {profileMessage ? statusText(profileMessage.ok, profileMessage.text) : null}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black">Визуалы бренда</h2>
          <form className="mt-5 space-y-4" onSubmit={submitVisuals}>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="h-40 bg-cover bg-center" style={coverSource ? { backgroundImage: `url(${coverSource})` } : { background: fallback.coverGradient }} />
              <div className="flex items-end gap-4 p-4">
                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-cover bg-center text-2xl font-black text-white shadow-lg" style={logoSource ? { backgroundImage: `url(${logoSource})` } : { background: fallback.logoGradient }}>
                  {logoSource ? null : profile.name[0]?.toLocaleUpperCase("ru-RU") ?? "Б"}
                </div>
                <div>
                  <div className="font-black">{profile.name || "Бренд"}</div>
                  <div className="text-sm font-bold text-slate-400">{profile.category || "Категория"}</div>
                </div>
              </div>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Новый логотип
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange("logo")} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Новая промо-картинка
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange("cover")} />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={savingVisuals}><Camera className="h-4 w-4" />{savingVisuals ? "Загружаем..." : "Сохранить визуалы"}</Button>
              {visualsMessage ? statusText(visualsMessage.ok, visualsMessage.text) : null}
            </div>
          </form>
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Точки бренда</h2>
            <p className="mt-1 text-sm text-slate-500">Добавляйте филиалы и выбирайте основную точку бренда.</p>
            <p className="mt-1 text-xs font-bold text-slate-400">Можно не выбирать основную точку.</p>
          </div>
          <Badge>{locations.length ? `${locations.length} точек` : "Точек пока нет"}</Badge>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-3">
            {locations.length ? locations.map((location) => (
              <div key={location.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black">{location.name || "Точка бренда"}</h3>
                      {location.isMain ? <Badge variant="success">Основная</Badge> : null}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin className="h-4 w-4 text-blue-600" />{location.fullAddress || formatBrandLocation(location.city, location.address)}</div>
                    <div className="mt-2">{location.lat !== null && location.lng !== null ? <Badge variant="success">Адрес подтверждён</Badge> : <Badge variant="warning">Без координат</Badge>}</div>
                    {location.description ? <p className="mt-2 text-sm leading-6 text-slate-500">{location.description}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" type="button" onClick={() => startEditLocation(location)}><Pencil className="h-4 w-4" />Редактировать</Button>
                    <Button size="sm" variant="ghost" type="button" onClick={() => deleteLocation(location)}><Trash2 className="h-4 w-4" />Удалить</Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Plus className="h-5 w-5" /></div>
                <h3 className="mt-4 font-black">Добавьте первую точку бренда</h3>
                <p className="mt-1 text-sm text-slate-500">Она станет основной автоматически.</p>
              </div>
            )}
          </div>

          <form className="self-start rounded-2xl border border-slate-200 bg-slate-50 p-4" onSubmit={submitLocation}>
            <h3 className="font-black">{editingLocationId ? "Редактировать точку" : "Добавить точку"}</h3>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" placeholder="Название точки, опционально" value={locationForm.name} onChange={(event) => setLocationForm((current) => ({ ...current, name: event.target.value }))} />
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" value={locationForm.city} onChange={(event) => setLocationForm((current) => ({ ...current, city: event.target.value, address: "", fullAddress: "", lat: null, lng: null, geoProvider: null, geoPlaceId: null }))}>
                <option value="">Выберите город</option>
                {RUSSIAN_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <AddressAutocomplete
                city={locationForm.city}
                value={locationForm.address}
                disabled={!locationForm.city}
                onChange={updateLocationAddress}
                onSelect={selectLocationAddress}
              />
              {locationForm.address ? (
                locationForm.lat !== null && locationForm.lng !== null ? <Badge variant="success">Адрес подтверждён</Badge> : <Badge variant="warning">Адрес не подтверждён на карте</Badge>
              ) : null}
              <textarea className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" placeholder="Описание, опционально" value={locationForm.description} onChange={(event) => setLocationForm((current) => ({ ...current, description: event.target.value }))} />
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                <input type="checkbox" checked={locationForm.isMain} onChange={(event) => setLocationForm((current) => ({ ...current, isMain: event.target.checked }))} />
                Основная точка
              </label>
              <p className="text-xs font-bold leading-5 text-slate-400">Можно не выбирать основную точку. Если включить этот пункт, остальные точки перестанут быть основными.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="submit" disabled={savingLocation}><Check className="h-4 w-4" />{savingLocation ? "Сохраняем..." : "Сохранить точку"}</Button>
              {editingLocationId ? <Button type="button" variant="ghost" onClick={resetLocationForm}>Отмена</Button> : null}
            </div>
            {locationMessage ? <div className="mt-3">{statusText(locationMessage.ok, locationMessage.text)}</div> : null}
          </form>
        </div>
      </Card>
    </main>
  );
}
