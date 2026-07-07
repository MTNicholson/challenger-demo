import { BRAND_CATEGORIES } from "@/lib/brand-visuals";
import { RUSSIAN_CITIES } from "@/lib/russian-cities";

export function validateBrandCategory(category: string) {
  return BRAND_CATEGORIES.includes(category as (typeof BRAND_CATEGORIES)[number]);
}

export function validateRussianCity(city: string) {
  return RUSSIAN_CITIES.includes(city as (typeof RUSSIAN_CITIES)[number]);
}

export function getStringField(source: FormData | Record<string, unknown> | null, key: string) {
  if (!source) return "";
  if (source instanceof FormData) {
    const value = source.get(key);
    return typeof value === "string" ? value.trim() : "";
  }

  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalStringField(source: FormData | Record<string, unknown> | null, key: string) {
  return getStringField(source, key) || null;
}

export function getOptionalNumberField(source: FormData | Record<string, unknown> | null, key: string) {
  if (!source) return null;
  const rawValue = source instanceof FormData ? source.get(key) : source[key];
  const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value !== "number" && typeof value !== "string") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isValidLatitude(value: number | null) {
  return value === null || (value >= -90 && value <= 90);
}

export function isValidLongitude(value: number | null) {
  return value === null || (value >= -180 && value <= 180);
}
