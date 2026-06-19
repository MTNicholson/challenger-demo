import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCoins } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

type ChallengeCardProps = {
  href: string;
  title: string;
  brand: string;
  reward: number | string;
  emoji?: string;
  distance?: string;
  description?: string;
  variant?: "tile" | "compact";
  className?: string;
};

export function ChallengeCard({
  href,
  title,
  brand,
  reward,
  emoji = "✨",
  distance,
  description,
  variant = "tile",
  className,
}: ChallengeCardProps) {
  const rewardLabel =
    typeof reward === "number" ? `+${formatCoins(reward)}` : reward;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-4 rounded-[30px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
          className,
        )}
      >
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-amber-100 text-3xl">
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          {distance ? (
            <div className="flex items-center gap-1 text-sm font-bold text-slate-400">
              <MapPin className="h-4 w-4" />
              {distance}
            </div>
          ) : (
            <p className="text-sm font-bold text-slate-400">{brand}</p>
          )}
          <h3 className="mt-1 text-lg font-black leading-5">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
          ) : null}
        </div>
        <Badge variant="success" className="shrink-0">
          {rewardLabel}
        </Badge>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "relative min-h-48 overflow-hidden rounded-[30px] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/25" />
      <div className="relative flex h-full flex-col">
        <div className="text-4xl">{emoji}</div>
        <div className="mt-auto pt-8">
          <p className="text-xs font-bold opacity-60">{brand}</p>
          <h2 className="mt-1 text-lg font-black leading-5">{title}</h2>
          <Badge variant="coin" className="mt-4 bg-white/70 text-slate-950">
            {rewardLabel}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
