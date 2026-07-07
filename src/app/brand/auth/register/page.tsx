"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Camera, FileText, Globe, LockKeyhole, Mail, MapPin, UploadCloud } from "lucide-react";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { BRAND_CATEGORIES, getBrandCategoryFallback } from "@/lib/brand-visuals";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";
import { routes } from "@/lib/routes";
import { AddressAutocomplete, type AddressSuggestion } from "@/components/brand/address-autocomplete";
import styles from "./register.module.css";

type ImageFieldProps = {
  accept: string;
  disabled: boolean;
  hint: string;
  id: string;
  label: string;
  previewUrl: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ImageField({ accept, disabled, hint, id, label, previewUrl, onChange }: ImageFieldProps) {
  return (
    <label className={styles.imageField} htmlFor={id}>
      <span className={styles.imageLabel}>{label}</span>
      <span className={styles.imageDropzone}>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" />
        ) : (
          <span className={styles.imagePlaceholder}>
            <UploadCloud size={22} />
            <span>{hint}</span>
          </span>
        )}
      </span>
      <input id={id} type="file" accept={accept} disabled={disabled} onChange={onChange} />
    </label>
  );
}

export default function BrandRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoProvider, setGeoProvider] = useState<string | null>(null);
  const [geoPlaceId, setGeoPlaceId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const fallback = useMemo(() => getBrandCategoryFallback(category), [category]);
  const brandInitial = name.trim()[0]?.toLocaleUpperCase("ru-RU") ?? fallback.mark;

  function handleFileChange(
    fileSetter: (file: File | null) => void,
    previewSetter: (url: string | null) => void,
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      fileSetter(file);
      if (!file) {
        previewSetter(null);
      } else {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          previewSetter(typeof reader.result === "string" ? reader.result : null);
        });
        reader.readAsDataURL(file);
      }
      setError("");
    };
  }

  function updateAddress(value: string) {
    setAddress(value);
    setFullAddress("");
    setLat(null);
    setLng(null);
    setGeoProvider(null);
    setGeoPlaceId(null);
    setError("");
  }

  function selectAddress(suggestion: AddressSuggestion) {
    setAddress(suggestion.value || suggestion.unrestrictedValue);
    setFullAddress(suggestion.unrestrictedValue);
    setLat(suggestion.lat);
    setLng(suggestion.lng);
    setGeoProvider(suggestion.geoProvider);
    setGeoPlaceId(suggestion.geoPlaceId);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !category.trim() || !city.trim() || !address.trim()) {
      setError("Заполните обязательные поля бренда.");
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("city", city);
    formData.set("address", address);
    formData.set("fullAddress", fullAddress);
    if (lat !== null) formData.set("lat", String(lat));
    if (lng !== null) formData.set("lng", String(lng));
    if (geoProvider) formData.set("geoProvider", geoProvider);
    if (geoPlaceId) formData.set("geoPlaceId", geoPlaceId);
    formData.set("category", category);
    formData.set("description", description);
    formData.set("website", website);
    if (logoFile) formData.set("logo", logoFile);
    if (coverImageFile) formData.set("coverImage", coverImageFile);

    setPending(true);
    const response = await fetch("/api/brand/auth/register", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(data?.error ?? "Не удалось зарегистрировать бренд. Попробуйте ещё раз.");
      return;
    }

    router.replace(routes.brand.dashboard);
  }

  return (
    <main className={styles.page}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>Ч</span>
        <span>ЧЕЛЛЕНДЖЕР</span>
      </div>

      <section className={styles.shell}>
        <div className={styles.header}>
          <span className={styles.kicker}>B2B кабинет</span>
          <h1>Регистрация бренда</h1>
          <p>Создайте профиль компании, добавьте базовые визуалы и получите доступ к кабинету бренда.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}>
              <Building2 size={18} />
              <div>
                <h2>Основная информация</h2>
                <p>Поля со звёздочкой обязательны для регистрации.</p>
              </div>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Название бренда *</span>
                <input autoComplete="organization" value={name} disabled={pending} placeholder="Например, Хлебник" onChange={(event) => { setName(event.target.value); setError(""); }} />
              </label>
              <label className={styles.field}>
                <span>Email для входа *</span>
                <span className={styles.inputWithIcon}>
                  <Mail size={17} />
                  <input type="email" autoComplete="email" value={email} disabled={pending} placeholder="owner@brand.ru" onChange={(event) => { setEmail(event.target.value); setError(""); }} />
                </span>
              </label>
              <label className={styles.field}>
                <span>Пароль *</span>
                <span className={styles.inputWithIcon}>
                  <LockKeyhole size={17} />
                  <input type="password" autoComplete="new-password" value={password} disabled={pending} placeholder="Минимум 6 символов" onChange={(event) => { setPassword(event.target.value); setError(""); }} />
                </span>
              </label>
              <label className={styles.field}>
                <span>Город *</span>
                <span className={styles.inputWithIcon}>
                  <MapPin size={17} />
                  <select value={city} disabled={pending} onChange={(event) => { setCity(event.target.value); updateAddress(""); }}>
                    <option value="">Выберите город</option>
                    {RUSSIAN_CITIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </span>
              </label>
              <label className={styles.field}>
                <span>Адрес *</span>
                <AddressAutocomplete
                  city={city}
                  value={address}
                  disabled={pending || !city}
                  placeholder="Невский проспект, 24"
                  onChange={updateAddress}
                  onSelect={selectAddress}
                />
                {address ? (
                  lat !== null && lng !== null ? <small>Адрес подтверждён</small> : <small>Адрес можно сохранить вручную, но без координат.</small>
                ) : null}
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                <span>Сайт</span>
                <span className={styles.inputWithIcon}>
                  <Globe size={17} />
                  <input type="url" autoComplete="url" value={website} disabled={pending} placeholder="https://brand.ru" onChange={(event) => setWebsite(event.target.value)} />
                </span>
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                <span>Описание бренда</span>
                <span className={styles.textareaWithIcon}>
                  <FileText size={17} />
                  <textarea value={description} disabled={pending} placeholder="Коротко расскажите, чем занимается компания" rows={4} onChange={(event) => setDescription(event.target.value)} />
                </span>
              </label>
            </div>

            <div className={styles.categoryBlock}>
              <span className={styles.categoryLabel}>Категория компании *</span>
              <div className={styles.categories}>
                {BRAND_CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={item === category ? styles.categoryActive : styles.category}
                    disabled={pending}
                    onClick={() => {
                      setCategory(item);
                      setError("");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {error ? <p className={styles.error} role="alert">{error}</p> : null}

            <div className={styles.actions}>
              <button className={styles.primary} type="submit" disabled={pending}>
                {pending ? "Создаём кабинет..." : "Создать кабинет бренда"}
              </button>
              <Link className={styles.loginLink} href={routes.brandAuth.login}>
                Уже есть кабинет? <strong>Войти</strong>
              </Link>
            </div>
          </section>

          <aside className={styles.side}>
            <section className={styles.panel}>
              <div className={styles.sectionTitle}>
                <Camera size={18} />
                <div>
                  <h2>Визуалы бренда</h2>
                  <p>JPG, PNG или WebP до 5 МБ. Можно добавить позже, но превью уже покажет результат.</p>
                </div>
              </div>

              <div className={styles.uploadGrid}>
                <ImageField
                  accept="image/jpeg,image/png,image/webp"
                  disabled={pending}
                  hint="Выбрать логотип"
                  id="brand-logo"
                  label="Логотип бренда"
                  previewUrl={logoPreviewUrl}
                  onChange={handleFileChange(setLogoFile, setLogoPreviewUrl)}
                />
                <ImageField
                  accept="image/jpeg,image/png,image/webp"
                  disabled={pending}
                  hint="Выбрать промо-картинку"
                  id="brand-cover"
                  label="Промо-картинка"
                  previewUrl={coverPreviewUrl}
                  onChange={handleFileChange(setCoverImageFile, setCoverPreviewUrl)}
                />
              </div>
            </section>

            <section className={styles.previewCard}>
              <div
                className={styles.previewCover}
                style={coverPreviewUrl ? { backgroundImage: `url(${coverPreviewUrl})` } : { background: fallback.coverGradient }}
              />
              <div className={styles.previewBody}>
                <div
                  className={styles.previewLogo}
                  style={logoPreviewUrl ? { backgroundImage: `url(${logoPreviewUrl})` } : { background: fallback.logoGradient }}
                >
                  {logoPreviewUrl ? null : brandInitial}
                </div>
                <span className={styles.previewCategory}>{category || fallback.label}</span>
                <h2>{name.trim() || "Название бренда"}</h2>
                <p>{description.trim() || "Короткое описание поможет гостям понять, почему стоит открыть бренд и участвовать в челленджах."}</p>
              </div>
            </section>
          </aside>
        </form>
      </section>
    </main>
  );
}
