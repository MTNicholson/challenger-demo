import { Coffee, Gift, Heart, MapPin } from "lucide-react";
import { brands } from "@/data/brands";
import { challenges } from "@/data/challenges";

export default function BrandPreviewPage() {
  const brand = brands[0];
  const brandChallenges = challenges.filter(
    (challenge) => challenge.brandId === brand.id,
  );

  return (
    <main className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="rounded-[38px] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-900/10">
        <div className="overflow-hidden rounded-[30px] bg-[#f6f2ea]">
          <div className="h-36 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white text-3xl">
                {brand.logo}
              </div>
              <Heart className="h-6 w-6 text-white/60" />
            </div>
          </div>
          <div className="p-5">
            <div className="-mt-11 mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">
              {brand.category}
            </div>
            <h1 className="text-3xl font-black">{brand.name}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {brand.description}
            </p>
            <div className="mt-5 flex gap-2 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2">
                <MapPin className="h-3.5 w-3.5" />
                {brand.locationsCount} точек
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2">
                <Coffee className="h-3.5 w-3.5" />
                {brand.followers} гостей
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {brandChallenges.map((challenge) => (
                <div key={challenge.id} className="rounded-[24px] bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50">
                      <Gift className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="font-black">{challenge.title}</div>
                      <div className="text-xs text-slate-500">
                        {challenge.reward}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-400">Публичный вид</div>
        <h2 className="mt-1 text-3xl font-black">Как бренд выглядит у гостя</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Этот экран нужен для инвесторского демо: бренд видит, как карточка и
          активные челленджи будут смотреться в пользовательском приложении.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["Понятная карточка", "Живые челленджи", "QR-награды"].map((item) => (
            <div key={item} className="rounded-[24px] bg-slate-50 p-4">
              <div className="text-sm font-black">{item}</div>
              <div className="mt-2 text-xs leading-5 text-slate-500">
                Мягкая визуальная подача без лишних настроек.
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
