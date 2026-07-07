export const BRAND_CATEGORIES = [
  "Спорт",
  "Еда",
  "Кофе",
  "Красота",
  "Образование",
  "Цветы",
  "Развлечения",
] as const;

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

type BrandCategoryFallback = {
  label: string;
  mark: string;
  logoGradient: string;
  coverGradient: string;
};

const fallbackByCategory: Record<string, BrandCategoryFallback> = {
  спорт: {
    label: "Спорт",
    mark: "S",
    logoGradient: "linear-gradient(145deg, #1d4ed8, #38bdf8)",
    coverGradient: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 48%, #bfdbfe 100%)",
  },
  еда: {
    label: "Еда",
    mark: "F",
    logoGradient: "linear-gradient(145deg, #ea580c, #facc15)",
    coverGradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)",
  },
  кофе: {
    label: "Кофе",
    mark: "C",
    logoGradient: "linear-gradient(145deg, #1e40af, #60a5fa)",
    coverGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #f8fafc 100%)",
  },
  кофейня: {
    label: "Кофе",
    mark: "C",
    logoGradient: "linear-gradient(145deg, #1e40af, #60a5fa)",
    coverGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #f8fafc 100%)",
  },
  красота: {
    label: "Красота",
    mark: "B",
    logoGradient: "linear-gradient(145deg, #be185d, #f9a8d4)",
    coverGradient: "linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #eff6ff 100%)",
  },
  образование: {
    label: "Образование",
    mark: "E",
    logoGradient: "linear-gradient(145deg, #4338ca, #818cf8)",
    coverGradient: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f8fafc 100%)",
  },
  цветы: {
    label: "Цветы",
    mark: "F",
    logoGradient: "linear-gradient(145deg, #15803d, #86efac)",
    coverGradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 48%, #eff6ff 100%)",
  },
  развлечения: {
    label: "Развлечения",
    mark: "R",
    logoGradient: "linear-gradient(145deg, #7c3aed, #38bdf8)",
    coverGradient: "linear-gradient(135deg, #f5f3ff 0%, #e0f2fe 48%, #eff6ff 100%)",
  },
  фитнес: {
    label: "Спорт",
    mark: "S",
    logoGradient: "linear-gradient(145deg, #1d4ed8, #38bdf8)",
    coverGradient: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 48%, #bfdbfe 100%)",
  },
  beauty: {
    label: "Красота",
    mark: "B",
    logoGradient: "linear-gradient(145deg, #be185d, #f9a8d4)",
    coverGradient: "linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #eff6ff 100%)",
  },
  булочная: {
    label: "Еда",
    mark: "F",
    logoGradient: "linear-gradient(145deg, #ea580c, #facc15)",
    coverGradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)",
  },
};

const defaultFallback: BrandCategoryFallback = {
  label: "Бренд",
  mark: "Б",
  logoGradient: "linear-gradient(145deg, #1e3a8a, #2563eb)",
  coverGradient: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 48%, #dbeafe 100%)",
};

export function getBrandCategoryFallback(category?: string | null): BrandCategoryFallback {
  const key = category?.trim().toLocaleLowerCase("ru-RU") ?? "";
  return fallbackByCategory[key] ?? defaultFallback;
}
