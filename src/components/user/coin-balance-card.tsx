import Link from "next/link";
import { ChevronRight, Coins } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCoins } from "@/lib/format";
import { glassPanelClasses, glassPanelStrongClasses } from "@/components/ui/glass";

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
        glassPanelClasses,
        glassPanelStrongClasses,
        "flex min-h-[66px] items-center justify-between rounded-[24px] px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-[var(--glass-shadow-floating)]",
        tone === "amber" ? "bg-amber-100/65 text-amber-950" : "",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "grid h-9 w-9 place-items-center rounded-[13px] shadow-sm",
            tone === "amber" ? "bg-white/55 text-amber-700" : "bg-gradient-to-br from-amber-200 to-orange-300 text-amber-900",
          )}
        >
          <Coins className="h-[18px] w-[18px]" />
        </div>
        <p className="text-[17px] font-extrabold tracking-[-0.02em]">{formatCoins(coins)}</p>
      </div>
      <ChevronRight className="h-[18px] w-[18px] text-slate-400" />
    </Link>
  );
}
