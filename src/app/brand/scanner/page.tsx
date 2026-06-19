import Link from "next/link";
import { Camera, QrCode, ScanLine } from "lucide-react";
import { routes } from "@/lib/routes";

export default function StaffScannerPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[32px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-white/60">Сотрудник</div>
            <h1 className="mt-1 text-3xl font-black">QR-сканер</h1>
          </div>
          <Camera className="h-7 w-7 text-white/60" />
        </div>

        <div className="mt-8 grid min-h-[420px] place-items-center rounded-[32px] border border-white/10 bg-white/5">
          <div className="relative grid h-64 w-64 place-items-center rounded-[34px] border-2 border-dashed border-white/30">
            <QrCode className="h-28 w-28 text-white/75" />
            <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-emerald-300 shadow-lg shadow-emerald-300" />
          </div>
        </div>

        <Link
          href={routes.brand.scanResult}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-slate-950"
        >
          <ScanLine className="h-5 w-5" />
          Показать результат скана
        </Link>
      </section>

      <aside className="rounded-[32px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Инструкция</h2>
        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-500">
          <p>1. Наведите камеру на QR гостя.</p>
          <p>2. Проверьте награду и срок действия.</p>
          <p>3. Подтвердите выдачу в один клик.</p>
        </div>
      </aside>
    </main>
  );
}
