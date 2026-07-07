"use client";

import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandCard } from "@/components/user/brand-card";
import { BRAND_CATEGORIES } from "@/lib/brand-visuals";
import { useCurrentUser } from "@/lib/auth-client";
import { useFavoriteItems } from "@/lib/favorite-storage";
import type { PublicBrandSummary } from "@/lib/public-brands";
import styles from "./user-brands.module.css";

const fallbackCategories = ["Все", ...BRAND_CATEGORIES];
const sortOptions = [
  { value: "newest", label: "По новизне" },
  { value: "challenges", label: "По количеству челленджей" },
  { value: "alphabet", label: "По алфавиту" },
  { value: "favorites", label: "Сначала избранные" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

type UserBrandsClientProps = {
  brands: PublicBrandSummary[];
};

function normalize(value: string | null) {
  return value?.trim().toLocaleLowerCase() ?? "";
}

export function UserBrandsClient({ brands }: UserBrandsClientProps) {
  const { user } = useCurrentUser();
  const { items: favoriteItems } = useFavoriteItems(user?.id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [sortOpen, setSortOpen] = useState(false);
  const [draftSort, setDraftSort] = useState<SortValue | null>(null);
  const [appliedSort, setAppliedSort] = useState<SortValue | null>(null);
  const favoriteBrandIds = useMemo(
    () => new Set(favoriteItems.filter((item) => item.type === "brand").map((item) => item.id)),
    [favoriteItems],
  );
  const categories = useMemo(() => {
    const realCategories = brands
      .map((brand) => brand.category)
      .filter((item): item is string => Boolean(item));

    return Array.from(new Set(["Все", ...realCategories, ...fallbackCategories.slice(1)]));
  }, [brands]);

  const visibleBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    const filteredBrands = brands.filter((brand) => {
      const matchesCategory = category === "Все" || brand.category === category;
      const searchable = [
        brand.name,
        brand.category,
        brand.city,
        brand.address,
        brand.description,
      ]
        .map(normalize)
        .join(" ");
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    if (!appliedSort) return filteredBrands;

    return [...filteredBrands].sort((left, right) => {
      if (appliedSort === "newest") {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }

      if (appliedSort === "challenges") {
        return right.challengesCount - left.challengesCount;
      }

      if (appliedSort === "alphabet") {
        return left.name.localeCompare(right.name, "ru");
      }

      if (appliedSort === "favorites") {
        const leftFavorite = favoriteBrandIds.has(left.id) ? 1 : 0;
        const rightFavorite = favoriteBrandIds.has(right.id) ? 1 : 0;
        return rightFavorite - leftFavorite;
      }

      return 0;
    });
  }, [appliedSort, brands, category, favoriteBrandIds, query]);

  const appliedSortLabel = sortOptions.find((option) => option.value === appliedSort)?.label;

  return (
    <main className={styles.page}>
      <div className={styles.controlRow}>
        <div className={styles.sortWrap}>
          <button
            type="button"
            className={styles.filterButton}
            aria-expanded={sortOpen}
            aria-haspopup="dialog"
            aria-label="Открыть сортировку"
            onClick={() => {
              setDraftSort(appliedSort);
              setSortOpen((value) => !value);
            }}
          >
            <SlidersHorizontal aria-hidden size={19} />
          </button>

          {sortOpen ? (
            <div className={styles.sortPopover}>
              <div className={styles.sortTitle}>Сортировка</div>
              <div className={styles.sortOptions}>
                {sortOptions.map((option) => (
                  <label key={option.value} className={styles.sortOption}>
                    <input
                      type="radio"
                      name="brand-sort"
                      checked={draftSort === option.value}
                      onChange={() => setDraftSort(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
                <label className={styles.sortOptionDisabled}>
                  <input type="radio" name="brand-sort" disabled />
                  <span>
                    По удалённости
                    <small>Скоро — после добавления геолокации</small>
                  </span>
                </label>
              </div>
              <div className={styles.sortActions}>
                <button
                  type="button"
                  className={styles.sortReset}
                  onClick={() => {
                    setDraftSort(null);
                    setAppliedSort(null);
                    setSortOpen(false);
                  }}
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  className={styles.sortApply}
                  onClick={() => {
                    setAppliedSort(draftSort);
                    setSortOpen(false);
                  }}
                >
                  Применить
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <label className={styles.searchField}>
          <Search aria-hidden size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти бренд"
            aria-label="Поиск брендов"
          />
        </label>
      </div>

      <div className={styles.categories} aria-label="Категории брендов">
        {appliedSort && appliedSortLabel ? (
          <button
            type="button"
            className={styles.sortChip}
            onClick={() => {
              setAppliedSort(null);
              setDraftSort(null);
            }}
          >
            Сортировка: {appliedSortLabel}
            <X size={13} />
          </button>
        ) : null}
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={item === category ? styles.categoryActive : styles.category}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleBrands.length ? (
        <section className={styles.grid} aria-label="Список брендов">
          {visibleBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </section>
      ) : (
        <section className={styles.empty}>
          <span>
            <Sparkles size={25} />
          </span>
          <h2>Пока нет брендов</h2>
          <p>Когда бренды появятся в Челленджере, они будут здесь</p>
        </section>
      )}
    </main>
  );
}
