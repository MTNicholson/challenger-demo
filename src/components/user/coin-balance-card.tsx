import Link from "next/link";
import { ChevronRight, Coins } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCoins } from "@/lib/format";

type CoinBalanceCardProps = {
  href: string;
  coins: number;
  className?: string;
  tone?: "white" | "amber";
};

export function CoinBalanceCard({
  href,
  coins,
  className,
  tone = "white",
}: CoinBalanceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-[28px] border border-slate-200/70 p-4 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md",
        tone === "amber" ? "bg-amber-100 text-amber-950" : "bg-white",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl",
            tone === "amber" ? "bg-white/45 text-amber-800" : "bg-amber-100 text-amber-800",
          )}
        >
          <Coins className="h-6 w-6" />
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-semibold",
              tone === "amber" ? "text-amber-700" : "text-slate-400",
            )}
          >
            Баланс
          </p>
          <p className="text-2xl font-black">{formatCoins(coins)}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 opacity-50" />
    </Link>
  );
}
