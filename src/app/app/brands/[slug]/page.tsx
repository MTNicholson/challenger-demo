import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Globe, Sparkles } from "lucide-react";
import { getBrandCategoryFallback } from "@/lib/brand-visuals";
import { getCurrentUser } from "@/lib/auth-server";
import { getPublicBrandBySlug } from "@/lib/public-brands";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { BrandLocationsList } from "@/components/user/brand-locations-list";
import { FavoriteToggleButton } from "@/components/user/favorite-toggle-button";
import styles from "./user-brand-page.module.css";

export const dynamic = "force-dynamic";

function getInitial(name: string) {
  return name.trim()[0]?.toLocaleUpperCase() ?? "Б";
}

function formatStatus(status: string) {
  if (status === "active") return "Активен";
  if (status === "draft") return "Скоро";
  if (status === "paused") return "Пауза";
  return status;
}

function decodeSlugParam(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export default async function UserBrandPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ from?: string }> }) {
  const { slug } = await params;
  const { from } = await searchParams;
  const decodedSlug = decodeSlugParam(slug);
  const [brand, user] = await Promise.all([getPublicBrandBySlug(decodedSlug), getCurrentUser()]);

  if (!brand) notFound();

  const category = brand.category ?? "Бренд";
  const description = brand.description ?? "Скоро бренд добавит описание, задания и награды для гостей.";
  const fallback = getBrandCategoryFallback(brand.category);

  return (
    <main className={styles.page}>
      <Link href={from === "favorites" ? routes.user.favorites : routes.user.brands} className={buttonClasses({ variant: "ghost", size: "sm", className: "w-fit" })}>
        <ArrowLeft className="h-4 w-4" />
        К брендам
      </Link>

      <section className={styles.brandCard}>
      <section className={styles.hero}>
        <div
          className={styles.cover}
          style={brand.coverImageUrl ? { backgroundImage: `url(${brand.coverImageUrl})` } : { background: fallback.coverGradient }}
        />
        <div className={styles.heroTop}>
          <div
            className={styles.logo}
            style={brand.logoUrl ? { backgroundImage: `url(${brand.logoUrl})` } : { background: fallback.logoGradient }}
          >
            {brand.logoUrl ? null : getInitial(brand.name) || fallback.mark}
          </div>
          <div className={styles.heroCopy}>
            <span className={styles.category}>{category}</span>
            <h1 className={styles.title}>{brand.name}</h1>
          </div>
          <FavoriteToggleButton
            id={brand.id}
            type="brand"
            className={styles.favoriteButton}
            activeClassName={styles.favoriteButtonActive}
          />
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.metaGrid}>
          {brand.website ? (
            <a className={styles.website} href={brand.website} target="_blank" rel="noreferrer">
              <Globe size={16} />
              <span>{brand.website}</span>
              <ExternalLink size={13} />
            </a>
          ) : null}
        </div>
      </section>

      <section className={styles.challengeList} aria-labelledby="brand-challenges-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="brand-challenges-title">Челленджи бренда</h2>
            <p>Задания и награды, которые бренд готовит для гостей</p>
          </div>
        </div>

        {brand.challenges.length ? (
          brand.challenges.map((challenge) => (
            <article key={challenge.id} className={styles.challengeCard}>
              <div className={styles.challengeTopline}>
                <span className={styles.challengeType}>{challenge.type ?? "Челлендж"}</span>
                <span className={styles.challengeStatus}>{formatStatus(challenge.status)}</span>
              </div>
              <h3>{challenge.title}</h3>
              {challenge.description ? <p>{challenge.description}</p> : null}
              {challenge.reward ? <span className={styles.reward}>Награда: {challenge.reward}</span> : null}
            </article>
          ))
        ) : (
          <div className={styles.empty}>
            <div>
              <span className={styles.emptyIcon}>
                <Sparkles size={24} />
              </span>
              <h2>У бренда пока нет активных челленджей</h2>
              <p>Скоро здесь появятся задания и награды</p>
            </div>
          </div>
        )}
      </section>
      <BrandLocationsList locations={brand.locations} userCity={user?.city} />
      </section>
    </main>
  );
}
