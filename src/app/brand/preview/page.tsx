import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Gift, MapPin, Target } from "lucide-react";
import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const campaign = getBrandChallenges(companyBrand.id)[0];

export default function BrandPreviewPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="mx-auto w-full max-w-[420px] rounded-[42px] border-[8px] border-slate-950 bg-white p-3 shadow-2xl shadow-slate-900/15">
        <div className="overflow-hidden rounded-[30px] bg-[#f6f2ea]">
          <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-xs font-bold text-white/60">
            <span>9:41</span><span>Превью гостя</span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-sm">{companyBrand.logo}</div>
              <div><div className="font-black">{companyBrand.name}</div><div className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{companyBrand.locationsCount} точек</div></div>
            </div>

            <article className="mt-5 rounded-[28px] bg-slate-950 p-5 text-white shadow-xl">
              <div className="flex items-start justify-between gap-3"><Badge variant="success">Активен</Badge><span className="text-3xl">{campaign.emoji}</span></div>
              <h1 className="mt-5 text-2xl font-black">{campaign.title}</h1>
              <p className="mt-2 text-sm leading-6 text-white/65">{campaign.description}</p>
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-bold"><Target className="h-5 w-5 text-emerald-300" />{campaign.condition}</div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-bold"><Gift className="h-5 w-5 text-amber-300" />{campaign.reward}</div>
              </div>
            </article>

            <div className="mt-4 rounded-[24px] bg-white p-4">
              <div className="flex items-center justify-between text-sm"><span className="font-black">Ваш прогресс</span><span className="font-bold text-emerald-700">0 из 5</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[8%] rounded-full bg-emerald-400" /></div>
              <p className="mt-3 text-xs leading-5 text-slate-500">После пяти визитов награда появится в кошельке. Покажите её QR сотруднику Coffee Place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="self-start rounded-[32px] bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-400">Публичный вид</div>
        <h2 className="mt-1 text-3xl font-black">Так челлендж увидит гость</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Карточка сразу объясняет условие, награду и следующий шаг. Это моковый экран — публикация и реальные данные не используются.</p>
        <div className="mt-6 space-y-3">
          {["Гость присоединяется к челленджу", "Визиты отмечаются в прогрессе", "После 5-го визита открывается QR-награда"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold"><CheckCircle2 className="h-5 w-5 text-emerald-600" />{item}</div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={routes.brand.challenges} className={buttonClasses({ variant: "ghost" })}>К челленджам</Link>
          <Link href={routes.brand.analytics} className={buttonClasses({ variant: "dark" })}><BarChart3 className="h-4 w-4" />К аналитике<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
