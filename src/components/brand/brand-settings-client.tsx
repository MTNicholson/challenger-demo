"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save } from "lucide-react";
import { BRAND_CATEGORIES, getBrandCategoryFallback } from "@/lib/brand-visuals";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhoneFrame } from "@/components/user/challenge-phone-preview";

type BrandSettingsBrand = { id: string; name: string; category: string | null; city: string | null; address: string | null; description: string | null; website: string | null; logoUrl: string | null; coverImageUrl: string | null; };
type Props = { brand: BrandSettingsBrand };

function readFilePreview(file: File, callback: (value: string | null) => void) { const reader = new FileReader(); reader.addEventListener("load", () => callback(typeof reader.result === "string" ? reader.result : null)); reader.readAsDataURL(file); }
function Status({ ok, text }: { ok: boolean; text: string }) { return <div className={ok ? "rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700" : "rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600"}>{text}</div>; }

function BrandCardPreview({ name, category, description, logoUrl, coverUrl, fallback }: { name: string; category: string; description: string; logoUrl: string | null; coverUrl: string | null; fallback: ReturnType<typeof getBrandCategoryFallback> }) {
  return <PhoneFrame className="scale-[0.82] origin-top md:scale-90" resetKey={`${name}-${logoUrl}-${coverUrl}`}>
    <main className="min-h-full bg-[#f5f7fb] p-3 pt-5 text-[#202945]">
      <div className="overflow-hidden rounded-[20px] border border-[#dbe6f3] bg-white shadow-[0_16px_34px_rgba(48,59,92,.1)]">
        <div className="h-28 bg-cover bg-center" style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : { background: fallback.coverGradient }} />
        <div className="p-3"><div className="flex items-start gap-2"><div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white bg-cover bg-center text-xl font-black text-white shadow-md" style={logoUrl ? { backgroundImage: `url(${logoUrl})` } : { background: fallback.logoGradient }}>{logoUrl ? null : name.trim()[0]?.toLocaleUpperCase("ru-RU") ?? "Б"}</div><div className="min-w-0 flex-1"><span className="inline-flex rounded-full bg-[#f2f4ff] px-2 py-1 text-[7px] font-black text-[#5965bd]">{category || "Категория"}</span><h2 className="mt-1 truncate text-lg font-black tracking-tight">{name || "Бренд"}</h2></div><span className="text-lg text-[#e2647b]">♡</span></div><p className="mt-3 line-clamp-3 text-[9px] font-semibold leading-4 text-[#68738f]">{description || "Здесь будет описание бренда, его челленджи и награды для гостей."}</p><div className="mt-4 border-t border-slate-100 pt-3"><h3 className="text-sm font-black">Челленджи бренда</h3><div className="mt-2 rounded-xl bg-[#f8f9ff] p-2 text-[9px] font-bold text-[#5965bd]">Задания и награды для гостей</div></div><div className="mt-4 border-t border-slate-100 pt-3"><h3 className="text-sm font-black">Точки бренда</h3><div className="mt-2 rounded-xl bg-[#f8f9ff] p-2 text-[9px] font-bold text-slate-500">Адреса и филиалы</div></div></div>
      </div>
    </main>
  </PhoneFrame>;
}

export function BrandSettingsClient({ brand }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: brand.name, category: brand.category ?? "", city: brand.city ?? "", address: brand.address ?? "", description: brand.description ?? "", website: brand.website ?? "" });
  const [logoFile, setLogoFile] = useState<File | null>(null); const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null); const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false); const [savingVisuals, setSavingVisuals] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ ok: boolean; text: string } | null>(null); const [visualsMessage, setVisualsMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fallback = useMemo(() => getBrandCategoryFallback(profile.category), [profile.category]); const logoSource = logoPreview ?? brand.logoUrl; const coverSource = coverPreview ?? brand.coverImageUrl;
  const update = (key: keyof typeof profile, value: string) => { setProfile((current) => ({ ...current, [key]: value })); setProfileMessage(null); };
  const imageChange = (kind: "logo" | "cover") => (event: ChangeEvent<HTMLInputElement>) => {
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
  async function submitProfile(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSavingProfile(true); const response = await fetch("/api/brand/settings/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) }); const data = await response.json().catch(() => null) as { error?: string } | null; setSavingProfile(false); if (!response.ok) { setProfileMessage({ ok: false, text: data?.error ?? "Не удалось сохранить профиль." }); return; } setProfileMessage({ ok: true, text: "Профиль бренда обновлён." }); router.refresh(); }
  async function submitVisuals(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!logoFile && !coverFile) { setVisualsMessage({ ok: false, text: "Выберите новый логотип или промо-картинку." }); return; } const formData = new FormData(); if (logoFile) formData.set("logo", logoFile); if (coverFile) formData.set("coverImage", coverFile); setSavingVisuals(true); const response = await fetch("/api/brand/settings/visuals", { method: "PATCH", body: formData }); const data = await response.json().catch(() => null) as { error?: string } | null; setSavingVisuals(false); if (!response.ok) { setVisualsMessage({ ok: false, text: data?.error ?? "Не удалось обновить визуалы." }); return; } setLogoFile(null); setCoverFile(null); setVisualsMessage({ ok: true, text: "Визуалы бренда обновлены." }); router.refresh(); }
  return <main className="space-y-6"><header><div className="text-sm font-bold text-blue-700">Профиль компании</div><h1 className="mt-1 text-3xl font-black tracking-tight">Настройки бренда</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Обновляйте профиль и визуалы бренда. Точки вынесены в отдельную вкладку.</p></header><section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]"><Card className="p-6"><h2 className="text-xl font-black">Профиль бренда</h2><form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submitProfile}><label className="grid gap-2 text-sm font-bold text-slate-600">Название бренда<input className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.name} onChange={(event) => update("name", event.target.value)} /></label><label className="grid gap-2 text-sm font-bold text-slate-600">Категория<select className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.category} onChange={(event) => update("category", event.target.value)}><option value="">Выберите категорию</option>{BRAND_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-slate-600">Город основного присутствия<select className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.city} onChange={(event) => update("city", event.target.value)}><option value="">Выберите город</option>{RUSSIAN_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-slate-600">Основной адрес<input className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.address} onChange={(event) => update("address", event.target.value)} /></label><label className="grid gap-2 text-sm font-bold text-slate-600 md:col-span-2">Сайт<input className="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-900 outline-none focus:border-blue-500" value={profile.website} onChange={(event) => update("website", event.target.value)} placeholder="https://brand.ru" /></label><label className="grid gap-2 text-sm font-bold text-slate-600 md:col-span-2">Описание<textarea className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-500" value={profile.description} onChange={(event) => update("description", event.target.value)} /></label><div className="flex flex-wrap items-center gap-3 md:col-span-2"><Button type="submit" disabled={savingProfile}><Save className="h-4 w-4" />{savingProfile ? "Сохраняем..." : "Сохранить профиль"}</Button>{profileMessage ? <Status {...profileMessage} /> : null}</div></form></Card><Card className="overflow-hidden p-0"><div className="grid gap-4 p-6"><div><h2 className="text-xl font-black">Визуалы бренда</h2><p className="mt-1 text-sm leading-6 text-slate-500">Проверьте изменения на карточке бренда до сохранения.</p></div><form className="space-y-4" onSubmit={submitVisuals}><label className="grid gap-2 text-sm font-bold text-slate-600">Новый логотип<input type="file" accept="image/jpeg,image/png,image/webp" onChange={imageChange("logo")} /></label><label className="grid gap-2 text-sm font-bold text-slate-600">Новая промо-картинка<input type="file" accept="image/jpeg,image/png,image/webp" onChange={imageChange("cover")} /></label><div className="flex flex-wrap items-center gap-3"><Button type="submit" disabled={savingVisuals}><Camera className="h-4 w-4" />{savingVisuals ? "Загружаем..." : "Сохранить визуалы"}</Button>{visualsMessage ? <Status {...visualsMessage} /> : null}</div></form></div><div className="h-[470px] overflow-hidden border-t border-slate-100 bg-slate-50 pt-5"><BrandCardPreview name={profile.name} category={profile.category} description={profile.description} logoUrl={logoSource} coverUrl={coverSource} fallback={fallback} /></div></Card></section></main>;
}
