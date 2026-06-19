import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type ValueCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "emerald" | "amber" | "rose" | "sky" | "slate" | "violet";
};

const toneClasses: Record<NonNullable<ValueCardProps["tone"]>, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  sky: "bg-sky-50 text-sky-700",
  slate: "bg-slate-100 text-slate-700",
  violet: "bg-violet-50 text-violet-700",
};

export function ValueCard({
  icon: Icon,
  title,
  description,
  tone = "emerald",
}: ValueCardProps) {
  return (
    <article className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-sm shadow-slate-900/5">
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl",
          toneClasses[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
