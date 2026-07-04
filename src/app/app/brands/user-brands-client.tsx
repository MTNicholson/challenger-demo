"use client";

import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandCard } from "@/components/user/brand-card";
import type { PublicBrandSummary } from "@/lib/public-brands";
import styles from "./user-brands.module.css";

const fallbackCategories = ["Все", "Кофейня", "Еда", "Фитнес", "Beauty", "Книги"];

type UserBrandsClientProps = {
  brands: PublicBrandSummary[];
};

function normalize(value: string | null) {
  return value?.trim().toLocaleLowerCase() ?? "";
}

export function UserBrandsClient({ brands }: UserBrandsClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const categories = useMemo(() => {
    const realCategories = brands
      .map((brand) => brand.category)
      .filter((item): item is string => Boolean(item));

    return Array.from(new Set(["Все", ...realCategories, ...fallbackCategories.slice(1)]));
  }, [brands]);

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return brands.filter((brand) => {
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
  }, [brands, category, query]);

  return (
    <main className={styles.page}>
      <div className={styles.controlRow}>
        <button type="button" className={styles.filterButton} aria-label="Открыть фильтры">
          <SlidersHorizontal aria-hidden size={19} />
        </button>
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

      {filteredBrands.length ? (
        <section className={styles.grid} aria-label="Список брендов">
          {filteredBrands.map((brand) => (
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
