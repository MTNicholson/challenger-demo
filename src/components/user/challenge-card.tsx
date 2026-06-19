import Link from "next/link";
import { CheckCircle2, Clock3, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCoins } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

type ChallengeCardProps = {
  href: string;
  title: string;
  brand: string;
  reward: number | string;
  emoji?: string;
  distance?: string;
  description?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  rewardText?: string;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
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
  category,
  status,
  featured = false,
  rewardText,
  progress,
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
          "flex items-center gap-4 rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md",
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
        "relative min-h-48 overflow-hidden rounded-[28px] border border-white/60 p-4 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md",
        featured && "ring-2 ring-amber-300/80",
        className,
      )}
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/25" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="text-4xl">{emoji}</div>
          <div className="flex flex-col items-end gap-1">
            {featured ? (
              <Badge className="bg-white/75 text-slate-950">
                <Sparkles className="mr-1 h-3 w-3" />
                Хит
              </Badge>
            ) : null}
            {status ? (
              <Badge
                variant={progress ? "success" : "neutral"}
                className="bg-white/75 text-slate-950"
              >
                {progress ? <CheckCircle2 className="mr-1 h-3 w-3" /> : null}
                {status}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold opacity-70">
            {category ? <span>{category}</span> : null}
            {category ? <span>•</span> : null}
            <span>{brand}</span>
          </div>
          <h2 className="mt-1 text-lg font-black leading-5">{title}</h2>
          {rewardText ? (
            <p className="mt-2 line-clamp-2 text-xs font-bold leading-4 opacity-75">
              {rewardText}
            </p>
          ) : null}
          {progress ? (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between gap-2 text-xs font-black opacity-75">
                <span>{progress.label}</span>
                <Clock3 className="h-3.5 w-3.5 shrink-0" />
              </div>
              <ProgressBar
                value={progress.current}
                max={progress.total}
                size="sm"
                className="bg-white/30"
                indicatorClassName="bg-emerald-300"
              />
            </div>
          ) : null}
          <Badge variant="coin" className="mt-3 bg-white/75 text-slate-950">
            {rewardLabel}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
