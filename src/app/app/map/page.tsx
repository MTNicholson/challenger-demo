import { Coffee, MapPin, Navigation } from "lucide-react";
import { brands } from "@/data/brands";

export default function UserMapPage() {
  return (
    <main className="space-y-5">
      <section>
        <div className="text-sm font-semibold text-slate-400">Рядом</div>
        <h1 className="mt-1 text-3xl font-black">Карта брендов</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          В демо показываем точки, где можно выполнить челлендж и получить QR.
        </p>
      </section>

      <section className="relative h-72 overflow-hidden rounded-[34px] bg-[#dfe9df] shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px)] bg-[size:46px_46px]" />
        <div className="absolute left-10 top-10 rounded-full bg-white p-3 shadow-lg">
          <Coffee className="h-5 w-5 text-amber-700" />
        </div>
        <div className="absolute right-12 top-24 rounded-full bg-white p-3 shadow-lg">
          <MapPin className="h-5 w-5 text-rose-500" />
        </div>
        <div className="absolute bottom-12 left-28 rounded-full bg-slate-950 p-4 text-white shadow-xl">
          <Navigation className="h-5 w-5" />
        </div>
      </section>

      <section className="space-y-3">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-[28px] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-50 text-2xl">
                {brand.logo}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-black">{brand.name}</h2>
                <p className="text-sm text-slate-500">
                  {brand.category} • {brand.locationsCount} точки
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-700">Открыто</span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
