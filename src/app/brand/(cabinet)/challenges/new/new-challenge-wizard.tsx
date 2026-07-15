"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  CalendarDays,
  CalendarClock,
  Check,
  Coins,
  Eye,
  Footprints,
  Gift,
  Info,
  ImagePlus,
  MapPin,
  MapPinned,
  Save,
  Rocket,
  Settings2,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import type { BrandRewardDto } from "@/lib/brand-rewards";
import type { BrandChallengeDto, BrandChallengePayload, BrandChallengeStatus } from "@/lib/brand-challenges";
import type { BrandChallengeDraft } from "@/lib/brand-challenge-drafts";
import type { Challenge, ChallengeType } from "@/data/challenges";
import type { Location } from "@/data/locations";
import { PhoneFrame } from "@/components/user/challenge-phone-preview";
import { ChallengeDetailScreen } from "@/components/user/challenge-detail-screen";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type StepId = 1 | 2 | 3 | 4;
type TemplateId = "activity" | "visit" | "purchase";

type Template = {
  id: TemplateId;
  title: string;
  description: string;
  badges: string[];
  icon: LucideIcon;
  accent: "violet" | "blue" | "amber";
};

type ChallengeFormState = {
  heroImageUrl: string | null;
  heroImageFileName: string | null;
  title: string;
  description: string;
  mechanicType: string;
  visitsCount: number;
  stepsCount: number;
  dailyStepsCount: number;
  activeDaysCount: number;
  purchaseCount: number;
  minPurchaseAmount: number;
  purchaseAmount: number;
  taskDescription: string;
  visitInterval: string;
  allowDifferentLocations: boolean;
  purchaseConfirmation: string;
  rewardType: string;
  rewardTitle: string;
  useExistingReward: boolean;
  rewardTemplateId: string;
  rewardDescription: string;
  rewardLimit: number | null;
  rewardUnlimited: boolean;
  rewardCoins: number;
  startDate: string;
  endDate: string;
  rewardExpiresInDays: number;
  partialCoinsEnabled: boolean;
  partialCoinsAmount: number;
  selectedLocationIds: string[];
};

type BrandLocationOption = {
  id: string;
  title: string;
  address: string;
  district: string;
};

type SelectOption = {
  value: string;
  label: string;
};

const steps: Array<{ id: StepId; title: string; subtitle: string }> = [
  { id: 1, title: "Шаблон", subtitle: "Выберите категорию" },
  { id: 2, title: "Условия и награда", subtitle: "Настройте правила" },
  { id: 3, title: "Предпросмотр", subtitle: "Проверьте детали" },
  { id: 4, title: "Публикация", subtitle: "Запустите челлендж" },
];

const templates: Template[] = [
  {
    id: "activity",
    title: "Активность",
    description: "Шаги, спорт, прогулки и задания на действие",
    badges: ["Шаги", "Спорт", "Ежедневная цель"],
    icon: Footprints,
    accent: "violet",
  },
  {
    id: "visit",
    title: "Посещение",
    description: "Визиты в точки, маршруты и серии посещений",
    badges: ["QR-визит", "Серия визитов", "Маршрут"],
    icon: MapPin,
    accent: "blue",
  },
  {
    id: "purchase",
    title: "Покупки",
    description: "Покупки, чеки, суммы и накопительные механики",
    badges: ["Чек", "Серия покупок", "Сумма"],
    icon: ShoppingBag,
    accent: "amber",
  },
];

const templateTitles: Record<TemplateId, string> = {
  activity: "Активность",
  visit: "Посещение",
  purchase: "Покупки",
};

const mechanicOptions: Record<TemplateId, SelectOption[]> = {
  activity: [
    { value: "steps_total", label: "Пройти определённое количество шагов" },
    { value: "steps_daily", label: "Выполнять дневную цель по шагам" },
    { value: "workout_checkin", label: "Отметить тренировку или активность" },
    { value: "video_task", label: "Записать видео с выполнением задания" },
    { value: "social_post", label: "Сделать пост в соцсетях" },
  ],
  visit: [
    { value: "qr_visit", label: "Один QR-визит" },
    { value: "visit_series", label: "Серия визитов" },
    { value: "route", label: "Маршрут по нескольким точкам" },
    { value: "checkin", label: "Отметка в точке" },
  ],
  purchase: [
    { value: "purchase_count", label: "Совершить несколько покупок" },
    { value: "purchase_amount", label: "Набрать сумму покупок" },
    { value: "receipt_upload", label: "Загрузить чек" },
    { value: "product_category", label: "Купить товар из категории" },
  ],
};

const rewardOptions: SelectOption[] = [
  { value: "drink", label: "Напиток на выбор" },
  { value: "discount", label: "Скидка" },
  { value: "gift", label: "Подарок" },
  { value: "coins", label: "Баллы" },
  { value: "custom", label: "Другая награда" },
];

const visitIntervalOptions: SelectOption[] = [
  { value: "Без интервала", label: "Без интервала" },
  { value: "1 час", label: "1 час" },
  { value: "1 день", label: "1 день" },
  { value: "3 дня", label: "3 дня" },
];

const purchaseConfirmationOptions: SelectOption[] = [
  { value: "QR-код на кассе", label: "QR-код на кассе" },
  { value: "Загрузка чека", label: "Загрузка чека" },
  { value: "Чек или QR-код", label: "Чек или QR-код" },
];

function createDefaultForm(category: TemplateId, brandName: string, locations: BrandLocationOption[] = []): ChallengeFormState {
  const common = {
    heroImageUrl: null,
    heroImageFileName: null,
    rewardType: "drink",
    rewardTitle: "Напиток на выбор",
    useExistingReward: false,
    rewardTemplateId: "reward-drink",
    rewardLimit: 500,
    rewardUnlimited: false,
    rewardCoins: 200,
    startDate: "01.05.2024",
    endDate: "31.05.2024",
    rewardExpiresInDays: 15,
    partialCoinsEnabled: false,
    partialCoinsAmount: 100,
    selectedLocationIds: locations.map((location) => location.id),
    visitsCount: 5,
    stepsCount: 10000,
    dailyStepsCount: 8000,
    activeDaysCount: 7,
    purchaseCount: 5,
    minPurchaseAmount: 500,
    purchaseAmount: 3000,
    taskDescription: "Например: запишите короткое видео с прогулки или тренировки",
    visitInterval: "1 день",
    allowDifferentLocations: true,
    purchaseConfirmation: "Чек или QR-код",
  };

  if (category === "activity") {
    return {
      ...common,
      title: "10 000 шагов за неделю",
      description: "Выполняйте цель по активности и получайте награду от бренда.",
      mechanicType: "steps_total",
      rewardDescription: `Напиток на выбор в ${brandName}`,
    };
  }

  if (category === "purchase") {
    return {
      ...common,
      title: "Пятая покупка в подарок",
      description: "Совершайте покупки в точках бренда и получайте бонус.",
      mechanicType: "purchase_count",
      rewardDescription: "Напиток на выбор после серии покупок",
    };
  }

  return {
    ...common,
    title: "Кофейная неделя",
    description: `Посещайте кофейни сети ${brandName} и получайте награды.`,
    mechanicType: "visit_series",
    rewardDescription: `Любой напиток на выбор в сети ${brandName}`,
  };
}

const accentClasses: Record<Template["accent"], { icon: string; selected: string; halo: string }> = {
  violet: {
    icon: "bg-violet-50 text-violet-700 ring-violet-100",
    selected: "border-blue-300 bg-blue-50/70 shadow-blue-600/10",
    halo: "from-violet-100/80 to-blue-50/30",
  },
  blue: {
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    selected: "border-blue-300 bg-blue-50/70 shadow-blue-600/10",
    halo: "from-blue-100/80 to-sky-50/30",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700 ring-amber-100",
    selected: "border-blue-300 bg-blue-50/70 shadow-blue-600/10",
    halo: "from-amber-100/80 to-orange-50/30",
  },
};

const contentVariants = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
};

const templateIconMotion: Record<TemplateId, Variants> = {
  activity: {
    hover: {
      y: [0, -5, 2, -3, 0],
      rotate: [0, -3, 2, -1, 0],
      transition: { duration: 0.58, ease: "easeInOut" },
    },
  },
  visit: {
    hover: {
      y: [0, -8, 0],
      scale: [1, 1.1, 1.04],
      transition: { duration: 0.44, ease: "easeOut" },
    },
  },
  purchase: {
    hover: {
      rotate: [0, -5, 4, 0],
      scale: [1, 1.08, 1.03],
      transition: { duration: 0.48, ease: "easeOut" },
    },
  },
};

export function NewChallengeWizard({
  brandLogo,
  brandName,
  initialChallenge,
  locations,
  rewards,
  locationScope,
}: {
  brandLogo: string | null;
  brandName: string;
  initialChallenge?: BrandChallengeDto;
  locations: BrandLocationOption[];
  rewards: BrandRewardDto[];
  locationScope?: { mode: "EXTENDED" | "FLAGSHIP"; locationName: string };
}) {
  const router = useRouter();
  const initialCategory = (initialChallenge?.category as TemplateId | undefined) ?? "visit";
  const [currentStep, setCurrentStep] = useState<StepId>(initialChallenge ? 2 : 1);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(initialChallenge ? initialCategory : null);
  const [challengeForm, setChallengeForm] = useState<ChallengeFormState>(() => initialChallenge ? formFromPersistedChallenge(initialChallenge, brandName, locations) : createDefaultForm("visit", brandName, locations));
  const [draftSaved, setDraftSaved] = useState(false);
  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(initialChallenge?.id ?? null);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const selectedTitle = selectedTemplate ? templateTitles[selectedTemplate] : null;
  const listHref = locationScope ? routes.location.challenges : routes.brand.challenges;
  const cancelHref = locationScope ? routes.location.challenges : routes.brand.challenges;
  const canGoNext =
    (currentStep === 1 && Boolean(selectedTemplate)) ||
    (currentStep === 2 &&
      Boolean(challengeForm.title.trim()) &&
      Boolean(challengeForm.description.trim()) &&
      Boolean(challengeForm.mechanicType) &&
      Boolean(challengeForm.rewardDescription.trim()) &&
      challengeForm.selectedLocationIds.length > 0) ||
    currentStep > 2;

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  function handleTemplateSelect(template: TemplateId) {
    if (selectedTemplate !== template) {
      setChallengeForm(createDefaultForm(template, brandName, locations));
      setIsDirty(true);
    }

    setSelectedTemplate(template);
  }

  function updateChallengeForm<K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) {
    setChallengeForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setDraftSaved(false);
    setIsDirty(true);
  }

  function buildPayload(status: BrandChallengeStatus, publishAt?: string | null): BrandChallengePayload {
    return {
      title: challengeForm.title,
      description: challengeForm.description,
      category: selectedTemplate ?? "visit",
      mechanicType: challengeForm.mechanicType,
      mechanicParams: {
        visitsCount: challengeForm.visitsCount,
        stepsCount: challengeForm.stepsCount,
        dailyStepsCount: challengeForm.dailyStepsCount,
        activeDaysCount: challengeForm.activeDaysCount,
        purchaseCount: challengeForm.purchaseCount,
        minPurchaseAmount: challengeForm.minPurchaseAmount,
        purchaseAmount: challengeForm.purchaseAmount,
        taskDescription: challengeForm.taskDescription,
        visitInterval: challengeForm.visitInterval,
        allowDifferentLocations: locationScope ? false : challengeForm.allowDifferentLocations,
        purchaseConfirmation: challengeForm.purchaseConfirmation,
      },
      locationIds: challengeForm.selectedLocationIds,
      reward: {
        mode: challengeForm.useExistingReward ? "template" : "custom",
        templateId: challengeForm.useExistingReward ? challengeForm.rewardTemplateId : null,
        title: challengeForm.rewardTitle,
        description: challengeForm.rewardDescription,
        limit: challengeForm.rewardUnlimited ? null : challengeForm.rewardLimit,
        points: challengeForm.rewardCoins,
        expiresInDays: challengeForm.rewardExpiresInDays,
      },
      heroImageUrl: challengeForm.heroImageUrl,
      startDate: challengeForm.startDate,
      endDate: challengeForm.endDate,
      status,
      scheduledAt: publishAt ?? null,
    };
  }

  async function persistChallenge(status: BrandChallengeStatus, publishAt?: string | null) {
    const isNewChallenge = !currentChallengeId;
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(locationScope ? (currentChallengeId ? `/api/location/challenges/${currentChallengeId}` : "/api/location/challenges") : currentChallengeId ? `/api/brand/challenges/${currentChallengeId}` : "/api/brand/challenges", {
        method: locationScope ? (currentChallengeId ? "PATCH" : "POST") : currentChallengeId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(status, publishAt)),
      });
      const result = await response.json().catch(() => null) as { challenge?: BrandChallengeDto; error?: string } | null;
      if (!response.ok || !result?.challenge) throw new Error(result?.error ?? "Не удалось сохранить челлендж.");

      setCurrentChallengeId(result.challenge.id);
      setDraftSaved(status === "draft");
      setIsDirty(false);
      if (isNewChallenge && !locationScope) router.replace(`${routes.brand.newChallenge}?challengeId=${encodeURIComponent(result.challenge.id)}`);
      return result.challenge;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Не удалось сохранить челлендж.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function saveDraft() {
    return persistChallenge("draft");
  }

  function requestNavigation(href: string) {
    if (isDirty) {
      setPendingNavigation(href);
      return;
    }

    router.push(href);
  }

  function leaveWithoutSaving() {
    const href = pendingNavigation;
    setPendingNavigation(null);
    setIsDirty(false);
    if (href) router.push(href);
  }

  function saveAndLeave() {
    const href = pendingNavigation;
    void saveDraft();
    setPendingNavigation(null);
    if (href) router.push(href);
  }

  function goNext() {
    if (!canGoNext) return;
    setDraftSaved(false);
    setCurrentStep((step) => Math.min(step + 1, 4) as StepId);
  }

  function goBack() {
    setDraftSaved(false);
    setCurrentStep((step) => Math.max(step - 1, 1) as StepId);
  }

  return (
    <main className="space-y-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-400">Конструктор кампании · {brandName}</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Создание челленджа</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Настройте механику, награду и условия. Все значения демонстрационные — ничего не публикуется.
          </p>
        </div>
        <button
          type="button"
          className={buttonClasses({ variant: "ghost" })}
          onClick={() => requestNavigation(listHref)}
        >
          К списку челленджей
        </button>
      </header>

      <Stepper currentStep={currentStep} />

      <section className="min-h-[430px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {currentStep === 1 ? (
              <TemplateStep selectedTemplate={selectedTemplate} onSelect={handleTemplateSelect} />
            ) : null}
            {currentStep === 2 ? (
              <RulesStep
                brandLogo={brandLogo}
                brandName={brandName}
                category={selectedTemplate ?? "visit"}
                form={challengeForm}
                locations={locations}
                rewards={rewards}
                selectedTitle={selectedTitle}
                onChange={updateChallengeForm}
                fixedLocation={Boolean(locationScope)}
              />
            ) : null}
            {currentStep === 3 ? <PreviewStep brandLogo={brandLogo} brandName={brandName} category={selectedTemplate ?? "visit"} form={challengeForm} locations={locations} selectedTitle={selectedTitle} /> : null}
            {currentStep === 4 ? <PublishStepActual draftSaved={draftSaved} selectedTitle={selectedTitle} locationScope={locationScope} /> : null}
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="flex flex-col gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {currentStep === 1 ? (
            <button
              type="button"
              className={buttonClasses({
                variant: "secondary",
                size: "lg",
                className: "min-h-14 rounded-lg px-7 shadow-slate-900/8",
              })}
              onClick={() => requestNavigation(cancelHref)}
            >
              Отмена
            </button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button className="min-h-14 rounded-lg px-7 shadow-slate-900/8" size="lg" variant="secondary" onClick={goBack}>
                Назад
              </Button>
              {currentStep === 2 ? (
                <button
                  type="button"
                  className={buttonClasses({
                    variant: "ghost",
                    size: "lg",
                    className: "min-h-14 rounded-lg px-7",
                  })}
                  onClick={() => requestNavigation(cancelHref)}
                >
                  Отмена
                </button>
              ) : null}
            </div>
          )}
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {draftSaved ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-700">
              Черновик челленджа сохранён
            </span>
          ) : null}
          {currentStep >= 2 && currentStep < 4 ? (
            <Button className="min-h-14 rounded-lg px-7" size="lg" variant="secondary" onClick={saveDraft}>
              <Save className="h-4 w-4" />
              Сохранить черновик
            </Button>
          ) : null}
          {currentStep === 4 ? (
            <>
              <Button className="min-h-14 rounded-lg px-6" size="lg" variant="secondary" disabled={isSaving} onClick={() => void saveDraft()}>
              <Save className="h-4 w-4" />
              Сохранить черновик
              </Button>
              <Button className={cn("min-h-14 rounded-lg px-6", locationScope && "hidden")} size="lg" variant="secondary" disabled={isSaving} onClick={() => setIsScheduleDialogOpen(true)}>
                <CalendarClock className="h-4 w-4" />
                Запланировать публикацию
              </Button>
              {locationScope ? <Button className="min-h-14 rounded-lg px-7" size="lg" variant="primary" disabled={isSaving} onClick={() => setIsPublishDialogOpen(true)}><Rocket className="h-4 w-4" />{locationScope.mode === "EXTENDED" ? "Отправить на подтверждение" : "Опубликовать для этой точки"}</Button> : null}
              <Button className={cn("min-h-14 rounded-lg px-7", locationScope && "hidden")} size="lg" variant="primary" disabled={isSaving} onClick={() => setIsPublishDialogOpen(true)}>
                <Rocket className="h-4 w-4" />
                Опубликовать
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="lg"
              disabled={!canGoNext}
              className="min-h-14 rounded-lg px-8 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:bg-blue-600"
              onClick={goNext}
            >
              Далее
            </Button>
          )}
        </div>
      </footer>
      {pendingNavigation ? (
        <UnsavedChangesDialog
          onCancel={() => setPendingNavigation(null)}
          onLeave={leaveWithoutSaving}
          onSave={saveAndLeave}
        />
      ) : null}
      {saveError ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{saveError}</p> : null}
      {isPublishDialogOpen ? (
        <ConfirmPublishDialog
          isSaving={isSaving}
          title={challengeForm.title || "Этот челлендж"}
          onCancel={() => setIsPublishDialogOpen(false)}
          onConfirm={async () => {
            const saved = await persistChallenge("active");
            if (saved) router.push(locationScope ? routes.location.challenges : routes.brand.challenges);
          }}
        />
      ) : null}
      {isScheduleDialogOpen ? (
        <SchedulePublishDialog
          value={scheduledAt}
          isSaving={isSaving}
          onChange={setScheduledAt}
          onCancel={() => setIsScheduleDialogOpen(false)}
          onConfirm={async () => {
            if (!scheduledAt) return;
            const saved = await persistChallenge("scheduled", new Date(scheduledAt).toISOString());
            if (saved) router.push(routes.brand.challenges);
          }}
        />
      ) : null}
    </main>
  );
}

function UnsavedChangesDialog({
  onCancel,
  onLeave,
  onSave,
}: {
  onCancel: () => void;
  onLeave: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/20">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700">
          <Info className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-xl font-black text-slate-950">Несохранённые изменения</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          У вас есть несохранённые изменения. Сохранить черновик перед выходом?
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button className="rounded-lg" variant="secondary" onClick={onSave}>
            Сохранить черновик
          </Button>
          <Button className="rounded-lg" variant="ghost" onClick={onLeave}>
            Выйти без сохранения
          </Button>
          <Button className="rounded-lg" variant="dark" onClick={onCancel}>
            Остаться
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmPublishDialog({
  isSaving,
  onCancel,
  onConfirm,
  title,
}: {
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="publish-title" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Rocket className="h-6 w-6" /></span>
          <button type="button" aria-label="Закрыть" onClick={onCancel} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>
        <h2 id="publish-title" className="mt-5 text-2xl font-black text-slate-950">Опубликовать челлендж?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">«{title}» появится у пользователей бренда сразу после публикации. Проверьте период, награду и выбранные точки.</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" className="rounded-lg" disabled={isSaving} onClick={onCancel}>Вернуться к редактированию</Button>
          <Button variant="primary" className="rounded-lg" disabled={isSaving} onClick={onConfirm}><Rocket className="h-4 w-4" />{isSaving ? "Публикуем…" : "Да, опубликовать"}</Button>
        </div>
      </section>
    </div>
  );
}

function SchedulePublishDialog({
  isSaving,
  onCancel,
  onChange,
  onConfirm,
  value,
}: {
  isSaving: boolean;
  onCancel: () => void;
  onChange: (value: string) => void;
  onConfirm: () => void;
  value: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="schedule-title" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700"><CalendarClock className="h-6 w-6" /></span>
          <button type="button" aria-label="Закрыть" onClick={onCancel} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>
        <h2 id="schedule-title" className="mt-5 text-2xl font-black text-slate-950">Запланировать публикацию</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Укажите дату и время. До публикации челлендж будет отображаться во вкладке «Запланированные».</p>
        <label className="mt-5 block text-xs font-black uppercase tracking-[0.12em] text-slate-400">Дата и время
          <input type="datetime-local" value={value} min={new Date().toISOString().slice(0, 16)} onChange={(event) => onChange(event.target.value)} className="brand-field mt-2 h-12 w-full rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
        </label>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" className="rounded-lg" disabled={isSaving} onClick={onCancel}>Отмена</Button>
          <Button variant="primary" className="rounded-lg" disabled={isSaving || !value} onClick={onConfirm}><CalendarClock className="h-4 w-4" />{isSaving ? "Сохраняем…" : "Запланировать"}</Button>
        </div>
      </section>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: StepId }) {
  return (
    <nav aria-label="Этапы создания челленджа" className="overflow-x-auto pb-1">
      <ol className="flex min-w-[760px] items-start">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <li key={step.id} className="flex flex-1 items-start">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-black transition duration-200",
                    isCompleted && "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20",
                    isActive && "border-blue-600 bg-white text-blue-700",
                    !isCompleted && !isActive && "border-slate-200 bg-slate-100 text-slate-400",
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isCompleted ? (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0, scale: 0.65 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.65 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span key="number" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {step.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className={cn("text-sm font-black transition-colors", isActive ? "text-blue-700" : "text-slate-700")}>
                    {step.title}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-400">{step.subtitle}</div>
                </div>
              </div>
              {index < steps.length - 1 ? (
                <div className="mx-4 mt-4 h-px flex-1 bg-slate-200">
                  <div
                    className={cn(
                      "h-full bg-emerald-400 transition-[width] duration-300",
                      isCompleted ? "w-full" : "w-0",
                    )}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function TemplateStep({
  selectedTemplate,
  onSelect,
}: {
  selectedTemplate: TemplateId | null;
  onSelect: (template: TemplateId) => void;
}) {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const selected = selectedTemplate === template.id;
          const accent = accentClasses[template.accent];

          return (
            <motion.button
              key={template.id}
              type="button"
              aria-pressed={selected}
              whileHover="hover"
              whileTap={{ scale: 0.992 }}
              className={cn(
                "brand-interactive group relative flex min-h-[340px] overflow-hidden rounded-2xl border bg-white p-6 text-center shadow-sm shadow-slate-900/[0.04] outline-none transition duration-200 sm:min-h-[360px] xl:min-h-[380px]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950",
                selected ? accent.selected : "border-slate-200 hover:border-blue-200 hover:bg-white",
              )}
              onClick={() => onSelect(template.id)}
            >
              <div className={cn("absolute inset-x-0 top-0 h-36 bg-gradient-to-b opacity-90", accent.halo)} />
              {selected ? (
                <span className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/25">
                  <Check className="h-4 w-4" />
                </span>
              ) : null}
              <div className="relative flex min-h-full w-full flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                  <motion.span
                    className={cn(
                      "grid h-24 w-24 place-items-center rounded-[1.75rem] ring-1 shadow-sm shadow-slate-900/[0.04] transition duration-200 group-hover:shadow-md group-hover:shadow-slate-900/10",
                      accent.icon,
                    )}
                    variants={templateIconMotion[template.id]}
                  >
                    <Icon className="h-12 w-12 stroke-[1.8]" />
                  </motion.span>
                  <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-950">{template.title}</h3>
                  <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-slate-500">{template.description}</p>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {template.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="neutral"
                      className={cn(
                        "px-3.5 py-1.5",
                        selected ? "border-blue-200 bg-white/80 text-blue-700" : "bg-white/75",
                      )}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/65 px-4 py-3.5 text-sm leading-6 text-slate-600">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-blue-700 shadow-sm shadow-blue-900/5">
          <Info className="h-4 w-4" />
        </span>
        <p>
          <span className="font-black text-slate-800">Подсказка:</span> выбранная категория определяет механику и тип
          создаваемого челленджа.
        </p>
      </div>
    </div>
  );
}

function RulesStep({
  brandLogo,
  brandName,
  category,
  form,
  locations,
  rewards,
  selectedTitle,
  onChange,
  fixedLocation = false,
}: {
  brandLogo: string | null;
  brandName: string;
  category: TemplateId;
  form: ChallengeFormState;
  locations: BrandLocationOption[];
  rewards: BrandRewardDto[];
  selectedTitle: string | null;
  onChange: <K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) => void;
  fixedLocation?: boolean;
}) {
  const mechanics = mechanicOptions[category];
  const activeRewards = rewards;
  const currentMechanicLabel = mechanics.find((option) => option.value === form.mechanicType)?.label ?? "Механика не выбрана";
  const selectedLocationsText = getSelectedLocationsText(form.selectedLocationIds.length);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <div className="space-y-5">
        <FormSection
          icon={Settings2}
          title="Основная информация"
          description="Название и описание, которые увидит участник в приложении."
        >
          <TextInput
            required
            label="Название челленджа"
            placeholder="Например: Кофейная неделя"
            value={form.title}
            onChange={(value) => onChange("title", value)}
          />
          <TextAreaInput
            required
            label="Описание челленджа"
            placeholder="Коротко объясните механику и пользу для участника"
            value={form.description}
            onChange={(value) => onChange("description", value)}
          />
        </FormSection>

        <PromoImageUpload
          fileName={form.heroImageFileName}
          imageUrl={form.heroImageUrl}
          onUploaded={(url, filename) => {
            onChange("heroImageUrl", url);
            onChange("heroImageFileName", filename);
          }}
          onRemove={() => {
            onChange("heroImageUrl", null);
            onChange("heroImageFileName", null);
          }}
        />

        <FormSection
          icon={Target}
          title="Условия челленджа"
          description={`Категория: ${selectedTitle ?? "не выбрана"}. Список механик меняется под выбранный шаблон.`}
        >
          <SelectInput
            required
            label="Тип механики"
            options={mechanics}
            value={form.mechanicType}
            onChange={(value) => onChange("mechanicType", value)}
          />
          <MechanicFields category={category} form={form} onChange={onChange} fixedLocation={fixedLocation} />
          <SwitchField
            checked={form.partialCoinsEnabled}
            label="Разрешить частичное выполнение баллами"
            text="Участник сможет получить небольшой бонус за промежуточный прогресс."
            onChange={(value) => onChange("partialCoinsEnabled", value)}
          />
          {form.partialCoinsEnabled ? (
            <NumberInput
              label="Баллы за частичное выполнение"
              min={0}
              suffix="баллов"
              value={form.partialCoinsAmount}
              onChange={(value) => onChange("partialCoinsAmount", value)}
            />
          ) : null}
        </FormSection>

        <FormSection
          icon={MapPinned}
          className={fixedLocation ? "hidden" : undefined}
          title="Выбор точек"
          description="Пока это демонстрационная настройка без реального выбора локаций."
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-black text-slate-950">{selectedLocationsText}</div>
                <div className="mt-1 text-xs font-semibold text-slate-400">
                  {locations.length ? `${locations[0]?.title ?? brandName} и ещё ${Math.max(locations.length - 1, 0)} точек` : "Точки пока не добавлены"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onChange("selectedLocationIds", locations.map((location) => location.id))}
                >
                  Выбрать все
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onChange("selectedLocationIds", [])}>
                  Убрать все
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {locations.map((location) => {
                const checked = form.selectedLocationIds.includes(location.id);

                return (
                  <label
                    key={location.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                      checked ? "border-blue-200 bg-blue-50/70" : "border-slate-200 bg-white hover:border-blue-100 hover:bg-blue-50/35",
                    )}
                  >
                    <input
                      className="mt-1 h-4 w-4 accent-blue-600"
                      checked={checked}
                      type="checkbox"
                      onChange={(event) => {
                        const nextIds = event.target.checked
                          ? [...form.selectedLocationIds, location.id]
                          : form.selectedLocationIds.filter((id) => id !== location.id);
                        onChange("selectedLocationIds", nextIds);
                      }}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-slate-950">{location.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{location.address} · {location.district}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {!form.selectedLocationIds.length ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
                Выберите хотя бы одну точку
              </div>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          icon={Trophy}
          title="Награда"
          description="Настройте ценность награды, лимиты и срок действия после выполнения."
        >
          <SwitchField
            checked={form.useExistingReward}
            label="Свои награды"
            text="Выберите одну из заранее подготовленных наград бренда."
            onChange={(value) => {
              onChange("useExistingReward", value);
              const reward = activeRewards[0];
              if (value && reward) {
                onChange("rewardTemplateId", reward.id);
                onChange("rewardTitle", reward.title);
                onChange("rewardDescription", reward.description);
                onChange("rewardLimit", reward.limit);
                onChange("rewardUnlimited", reward.limit === null);
                onChange("rewardCoins", reward.points);
                if (reward.expiresInDays !== null) onChange("rewardExpiresInDays", reward.expiresInDays);
              }
            }}
          />
          {form.useExistingReward ? (
            activeRewards.length ? (
              <SelectInput
                label="Выберите награду"
                options={activeRewards.map((reward) => ({ value: reward.id, label: reward.title }))}
                value={form.rewardTemplateId}
                onChange={(value) => {
                  const reward = activeRewards.find((item) => item.id === value);
                  onChange("rewardTemplateId", value);
                  if (reward) {
                    onChange("rewardTitle", reward.title);
                    onChange("rewardDescription", reward.description);
                    onChange("rewardLimit", reward.limit);
                    onChange("rewardUnlimited", reward.limit === null);
                    onChange("rewardCoins", reward.points);
                    if (reward.expiresInDays !== null) onChange("rewardExpiresInDays", reward.expiresInDays);
                  }
                }}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="font-black text-slate-950">Нет активных наград</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Создайте награду в разделе «Награды», чтобы использовать её в челлендже.
                </p>
                <Link href={routes.brand.rewards} className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-4" })}>
                  Перейти в награды
                </Link>
              </div>
            )
          ) : (
            <TextInput
              label="Название награды"
              placeholder="Напиток на выбор"
              value={form.rewardTitle}
              onChange={(value) => onChange("rewardTitle", value)}
            />
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput
              disabled={form.rewardUnlimited}
              label="Лимит наград"
              min={0}
              suffix="штук"
              value={form.rewardLimit ?? 0}
              onChange={(value) => onChange("rewardLimit", value)}
            />
            <label className="flex items-center gap-3 self-end rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
              <input
                checked={form.rewardUnlimited}
                className="h-4 w-4 accent-blue-600"
                type="checkbox"
                onChange={(event) => {
                  onChange("rewardUnlimited", event.target.checked);
                  if (event.target.checked) onChange("rewardLimit", null);
                  else onChange("rewardLimit", 500);
                }}
              />
              Без лимита
            </label>
          </div>
          <TextAreaInput
            required
            label="Описание награды"
            placeholder="Любой напиток на выбор в сети Coffee Lover"
            value={form.rewardDescription}
            onChange={(value) => onChange("rewardDescription", value)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Дата старта" value={form.startDate} onChange={(value) => onChange("startDate", value)} />
            <TextInput label="Дата окончания" value={form.endDate} onChange={(value) => onChange("endDate", value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput
              hint={`Награда будет доступна в течение ${form.rewardExpiresInDays} дней с момента выполнения условий.`}
              label="Срок получения награды"
              min={1}
              suffix="дней"
              value={form.rewardExpiresInDays}
              onChange={(value) => onChange("rewardExpiresInDays", value)}
            />
            <NumberInput
              hint="Стоимость награды в баллах для участника."
              label="Количество баллов за награду"
              min={0}
              suffix="баллов"
              value={form.rewardCoins}
              onChange={(value) => onChange("rewardCoins", value)}
            />
          </div>
        </FormSection>
      </div>

      <ChallengeLivePreview
        brandLogo={brandLogo}
        brandName={brandName}
        category={category}
        currentMechanicLabel={currentMechanicLabel}
        form={form}
        locations={locations}
        selectedTitle={selectedTitle ?? templateTitles[category]}
      />
    </div>
  );
}

function MechanicFields({
  category,
  fixedLocation = false,
  form,
  onChange,
}: {
  category: TemplateId;
  fixedLocation?: boolean;
  form: ChallengeFormState;
  onChange: <K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) => void;
}) {
  if (category === "activity") {
    if (form.mechanicType === "steps_daily") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <NumberInput label="Дневная цель" min={0} suffix="шагов" value={form.dailyStepsCount} onChange={(value) => onChange("dailyStepsCount", value)} />
          <NumberInput label="Количество дней" min={1} suffix="дней" value={form.activeDaysCount} onChange={(value) => onChange("activeDaysCount", value)} />
        </div>
      );
    }

    if (["video_task", "social_post", "workout_checkin"].includes(form.mechanicType)) {
      return (
        <TextAreaInput
          label="Описание задания"
          placeholder="Например: запишите короткое видео с прогулки или тренировки"
          value={form.taskDescription}
          onChange={(value) => onChange("taskDescription", value)}
        />
      );
    }

    return (
      <NumberInput label="Количество шагов" min={0} suffix="шагов" value={form.stepsCount} onChange={(value) => onChange("stepsCount", value)} />
    );
  }

  if (category === "purchase") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <NumberInput label="Количество покупок" min={1} suffix="покупок" value={form.purchaseCount} onChange={(value) => onChange("purchaseCount", value)} />
        <NumberInput label="Минимальная сумма покупки" min={0} suffix="₽" value={form.minPurchaseAmount} onChange={(value) => onChange("minPurchaseAmount", value)} />
        <NumberInput label="Общая сумма покупок" min={0} suffix="₽" value={form.purchaseAmount} onChange={(value) => onChange("purchaseAmount", value)} />
        <SelectInput
          label="Подтверждение"
          options={purchaseConfirmationOptions}
          value={form.purchaseConfirmation}
          onChange={(value) => onChange("purchaseConfirmation", value)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <NumberInput label="Количество визитов" min={1} suffix="визитов" value={form.visitsCount} onChange={(value) => onChange("visitsCount", value)} />
        <SelectInput
          label="Минимальный интервал"
          options={visitIntervalOptions}
          value={form.visitInterval}
          onChange={(value) => onChange("visitInterval", value)}
        />
      </div>
      {!fixedLocation ? <SwitchField
        checked={form.allowDifferentLocations}
        label="Можно выполнять в разных точках"
        text="Визиты засчитываются в любой выбранной точке бренда."
        onChange={(value) => onChange("allowDifferentLocations", value)}
      /> : null}
    </>
  );
}

function PromoImageUpload({
  fileName,
  imageUrl,
  onRemove,
  onUploaded,
}: {
  fileName: string | null;
  imageUrl: string | null;
  onRemove: () => void;
  onUploaded: (url: string, filename: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.set("heroImage", file);
    setIsUploading(true);
    setUploadError(null);
    const response = await fetch("/api/brand/challenges/hero-image", { method: "POST", body: formData });
    const data = (await response.json().catch(() => null)) as { error?: string; filename?: string; url?: string } | null;
    setIsUploading(false);

    if (!response.ok || !data?.url) {
      setUploadError(data?.error ?? "Не удалось загрузить изображение.");
      return;
    }

    onUploaded(data.url, data.filename ?? file.name);
  }

  return (
    <FormSection
      icon={ImagePlus}
      title="Промо-изображение челленджа"
      description="Это изображение будет показано в верхней части карточки челленджа у пользователя."
    >
      <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
        <div
          className="grid min-h-44 place-items-center bg-cover bg-center p-5"
          style={imageUrl ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, .12), rgba(15, 23, 42, .12)), url(${imageUrl})` } : undefined}
        >
          {imageUrl ? (
            <span className="rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-black text-white">Изображение выбрано</span>
          ) : (
            <div className="text-center text-slate-400">
              <ImagePlus className="mx-auto h-7 w-7" />
              <div className="mt-2 text-sm font-black text-slate-600">Загрузите изображение</div>
              <p className="mt-1 text-xs font-semibold">Рекомендуемый формат: горизонтальное изображение 1200×700 или близкое по пропорциям.</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white p-3">
          <span className="min-w-0 truncate text-xs font-bold text-slate-500">{isUploading ? "Загружаем изображение…" : fileName ?? "Файл не выбран"}</span>
          <div className="flex gap-2">
            <label className={buttonClasses({ variant: "secondary", size: "sm" })}>
              {imageUrl ? "Заменить" : "Выбрать файл"}
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploading}
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  if (nextFile) void uploadImage(nextFile);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            {imageUrl ? <Button size="sm" variant="ghost" onClick={onRemove}>Удалить</Button> : null}
          </div>
        </div>
        {uploadError ? <div className="border-t border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">{uploadError}</div> : null}
      </div>
    </FormSection>
  );
}

function ChallengeLivePreview({
  brandLogo,
  brandName,
  category,
  currentMechanicLabel,
  form,
  locations,
  selectedTitle,
}: {
  brandLogo: string | null;
  brandName: string;
  category: TemplateId;
  currentMechanicLabel: string;
  form: ChallengeFormState;
  locations: BrandLocationOption[];
  selectedTitle: string;
}) {
  const condition = getConditionSummary(category, form);
  const rewardLabel = rewardOptions.find((option) => option.value === form.rewardType)?.label ?? "Награда";
  const TemplateIcon = templates.find((template) => template.id === category)?.icon ?? Sparkles;
  const rewardTitle = form.rewardTitle || rewardLabel;
  const rewardLimitText = form.rewardUnlimited || form.rewardLimit === null ? "без лимита" : String(form.rewardLimit);

  if (locations) {
    return (
      <aside className="sticky top-24 self-start">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-white px-5 py-4">
            <div className="text-sm font-black text-slate-950">Предпросмотр для пользователя</div>
            <div className="mt-1 text-xs font-semibold text-slate-400">Так челлендж будет выглядеть в приложении.</div>
          </div>
          <div className="flex max-h-[calc(100dvh-10rem)] justify-center overflow-hidden bg-slate-50/70 p-4">
            <PhoneFrame resetKey={`${form.title}-${form.heroImageUrl ?? "fallback"}`}>
              <ChallengeDetailScreen challenge={buildPreviewChallenge({ brandLogo, brandName, category, form })} locations={toPreviewLocations(locations, form.selectedLocationIds)} isPreview />
            </PhoneFrame>
          </div>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="xl:sticky xl:top-28 xl:self-start">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <div className="text-sm font-black text-slate-950">Предпросмотр для пользователя</div>
          <div className="mt-1 text-xs font-semibold text-slate-400">Обновляется по мере заполнения формы</div>
        </div>
        <div className="bg-slate-50/70 p-4 sm:p-5">
          <div className="mx-auto max-w-[390px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-white/65">{brandName}</div>
                  <div className="mt-1 text-sm font-bold text-white/85">{selectedTitle}</div>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                  <TemplateIcon className="h-6 w-6" />
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-black leading-tight">{form.title || "Название челленджа"}</h3>
              <p className="mt-3 text-sm leading-6 text-white/78">{form.description || "Описание челленджа появится здесь."}</p>
            </div>

            <div className="space-y-4 p-5">
              <PreviewRow icon={Target} label="Условие" value={condition} />
              <PreviewRow icon={Gift} label="Награда" value={`${rewardTitle} + ${form.rewardCoins} баллов`} />
              <PreviewRow icon={Sparkles} label="Описание награды" value={form.rewardDescription || "Описание появится здесь"} />
              <PreviewRow icon={CalendarDays} label="Период" value={`${form.startDate} — ${form.endDate}`} />
              <PreviewRow icon={MapPinned} label="Точки" value={getSelectedLocationsText(form.selectedLocationIds.length)} />
              <PreviewRow icon={Trophy} label="Лимит" value={`Лимит: ${rewardLimitText}`} />
              <PreviewRow icon={Coins} label="Стоимость" value={`${form.rewardCoins} баллов`} />

              {form.partialCoinsEnabled ? (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm font-bold text-amber-800">
                  Частичный прогресс: {form.partialCoinsAmount} баллов
                </div>
              ) : null}

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-black text-slate-950">Прогресс</span>
                  <span className="font-bold text-blue-700">2 из 5</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-2/5 rounded-full bg-blue-600" />
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-400">{currentMechanicLabel}</div>
              </div>

              <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white" type="button">
                Участвовать
              </button>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}

function buildPreviewChallenge({
  brandLogo,
  brandName,
  category,
  form,
}: {
  brandLogo: string | null;
  brandName: string;
  category: TemplateId;
  form: ChallengeFormState;
}): Challenge {
  const typeByCategory: Record<TemplateId, ChallengeType> = {
    activity: "steps",
    visit: "visit_series",
    purchase: "coins",
  };

  return {
    id: "challenge-preview",
    title: form.title || "Название челленджа",
    brandId: "brand-preview",
    brandName,
    brandLogo: brandLogo ?? undefined,
    category: templateTitles[category],
    type: typeByCategory[category],
    difficulty: "easy",
    description: form.description || "Описание челленджа появится здесь.",
    fullDescription: form.description || "Описание челленджа появится здесь.",
    shortDescription: getConditionSummary(category, form),
    condition: getConditionSummary(category, form),
    reward: form.rewardTitle || "Награда будет указана позже",
    coinsReward: form.rewardCoins,
    emoji: "✦",
    cardClassName: "",
    daysLeft: 14,
    participants: 0,
    isActive: false,
    isFeatured: false,
    image: form.heroImageUrl ?? "/landing/challenges/coffee.webp",
    startDate: form.startDate,
    endDate: form.endDate,
  };
}

function toPreviewLocations(locations: BrandLocationOption[], selectedIds: string[]): Location[] {
  return locations
    .filter((location) => selectedIds.includes(location.id))
    .map((location) => ({ ...location, brandId: "brand-preview", distance: "Точка бренда" }));
}

function getConditionSummary(category: TemplateId, form: ChallengeFormState) {
  if (category === "activity") {
    if (form.mechanicType === "steps_daily") {
      return `${form.dailyStepsCount.toLocaleString("ru-RU")} шагов в день · ${form.activeDaysCount} дней`;
    }

    if (["video_task", "social_post", "workout_checkin"].includes(form.mechanicType)) {
      return form.taskDescription || "Выполнить задание бренда";
    }

    return `${form.stepsCount.toLocaleString("ru-RU")} шагов`;
  }

  if (category === "purchase") {
    if (form.mechanicType === "purchase_amount") {
      return `${form.purchaseAmount.toLocaleString("ru-RU")} ₽ общей суммы`;
    }

    if (form.mechanicType === "receipt_upload") {
      return `Загрузить чек от ${form.minPurchaseAmount.toLocaleString("ru-RU")} ₽`;
    }

    return `${form.purchaseCount} покупок`;
  }

  if (form.mechanicType === "qr_visit") {
    return "1 QR-визит";
  }

  return `${form.visitsCount} визитов`;
}

function getSelectedLocationsText(count: number) {
  if (count === 0) return "Выберите хотя бы одну точку";
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return `${count} точек выбрано`;
  if (last === 1) return `${count} точка выбрана`;
  if (last >= 2 && last <= 4) return `${count} точки выбрано`;
  return `${count} точек выбрано`;
}

function formFromPersistedChallenge(challenge: BrandChallengeDto, brandName: string, locations: BrandLocationOption[]): ChallengeFormState {
  const category = (challenge.category as TemplateId) ?? "visit";
  const fallback = createDefaultForm(category, brandName, locations);
  const params = challenge.mechanicParams ?? {};
  const reward = challenge.rewardData ?? fallbackRewardFromForm(fallback);
  const numberParam = (key: string, fallbackValue: number) => typeof params[key] === "number" ? params[key] : fallbackValue;
  const stringParam = (key: string, fallbackValue: string) => typeof params[key] === "string" ? params[key] : fallbackValue;
  const booleanParam = (key: string, fallbackValue: boolean) => typeof params[key] === "boolean" ? params[key] : fallbackValue;

  return {
    ...fallback,
    title: challenge.title,
    description: challenge.description ?? "",
    heroImageUrl: challenge.heroImageUrl,
    heroImageFileName: challenge.heroImageUrl ? "Загруженное изображение" : null,
    mechanicType: challenge.mechanicType ?? fallback.mechanicType,
    visitsCount: numberParam("visitsCount", fallback.visitsCount),
    stepsCount: numberParam("stepsCount", fallback.stepsCount),
    dailyStepsCount: numberParam("dailyStepsCount", fallback.dailyStepsCount),
    activeDaysCount: numberParam("activeDaysCount", fallback.activeDaysCount),
    purchaseCount: numberParam("purchaseCount", fallback.purchaseCount),
    minPurchaseAmount: numberParam("minPurchaseAmount", fallback.minPurchaseAmount),
    purchaseAmount: numberParam("purchaseAmount", fallback.purchaseAmount),
    taskDescription: stringParam("taskDescription", fallback.taskDescription),
    visitInterval: stringParam("visitInterval", fallback.visitInterval),
    allowDifferentLocations: booleanParam("allowDifferentLocations", fallback.allowDifferentLocations),
    purchaseConfirmation: stringParam("purchaseConfirmation", fallback.purchaseConfirmation),
    selectedLocationIds: challenge.locationIds,
    useExistingReward: reward.mode === "template",
    rewardTemplateId: reward.templateId ?? fallback.rewardTemplateId,
    rewardTitle: reward.title,
    rewardDescription: reward.description,
    rewardLimit: reward.limit,
    rewardUnlimited: reward.limit === null,
    rewardCoins: reward.points,
    rewardExpiresInDays: reward.expiresInDays,
    startDate: challenge.startsAt?.slice(0, 10) ?? fallback.startDate,
    endDate: challenge.endsAt?.slice(0, 10) ?? fallback.endDate,
  };
}

function fallbackRewardFromForm(form: ChallengeFormState): BrandChallengePayload["reward"] {
  return {
    mode: form.useExistingReward ? "template" : "custom",
    templateId: form.useExistingReward ? form.rewardTemplateId : null,
    title: form.rewardTitle,
    description: form.rewardDescription,
    limit: form.rewardUnlimited ? null : form.rewardLimit,
    points: form.rewardCoins,
    expiresInDays: form.rewardExpiresInDays,
  };
}

// Legacy local drafts remain readable only for existing browser data; new saves use the API and PostgreSQL.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formFromDraft(draft: BrandChallengeDraft, brandName: string, locations: BrandLocationOption[]): ChallengeFormState {
  const fallback = createDefaultForm(draft.category, brandName, locations);

  return {
    ...fallback,
    title: draft.title,
    description: draft.description,
    heroImageUrl: draft.heroImageUrl ?? null,
    heroImageFileName: draft.heroImageUrl ? "Загруженное изображение" : null,
    mechanicType: draft.mechanicType,
    visitsCount: draft.mechanicParams.visitsCount,
    stepsCount: draft.mechanicParams.stepsCount,
    dailyStepsCount: draft.mechanicParams.dailyStepsCount,
    activeDaysCount: draft.mechanicParams.activeDaysCount,
    purchaseCount: draft.mechanicParams.purchaseCount,
    minPurchaseAmount: draft.mechanicParams.minPurchaseAmount,
    purchaseAmount: draft.mechanicParams.purchaseAmount,
    taskDescription: draft.mechanicParams.taskDescription,
    visitInterval: draft.mechanicParams.visitInterval,
    allowDifferentLocations: draft.mechanicParams.allowDifferentLocations,
    purchaseConfirmation: draft.mechanicParams.purchaseConfirmation,
    selectedLocationIds: draft.selectedLocationIds,
    useExistingReward: draft.reward.mode === "template",
    rewardTemplateId: draft.reward.templateId ?? fallback.rewardTemplateId,
    rewardTitle: draft.reward.title,
    rewardDescription: draft.reward.description,
    rewardLimit: draft.reward.limit,
    rewardUnlimited: draft.reward.limit === null,
    rewardCoins: draft.reward.points,
    rewardExpiresInDays: draft.reward.expiresInDays,
    startDate: draft.period.startDate,
    endDate: draft.period.endDate,
  };
}

function PreviewRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-900/[0.03]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">{label}</div>
        <div className="mt-1 text-sm font-black leading-5 text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function FormSection({
  className,
  children,
  description,
  icon: Icon,
  title,
}: {
  className?: string;
  children: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </Card>
  );
}

function FieldShell({
  children,
  hint,
  label,
  required = false,
}: {
  children: ReactNode;
  hint?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
        {required ? <span className="text-blue-600">*</span> : null}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-2 block text-xs leading-5 text-slate-400">{hint}</span> : null}
    </label>
  );
}

function TextInput({
  hint,
  label,
  onChange,
  placeholder,
  required = false,
  value,
}: {
  hint?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <FieldShell hint={hint} label={label} required={required}>
      <input
        className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

function TextAreaInput({
  label,
  onChange,
  placeholder,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <FieldShell label={label} required={required}>
      <textarea
        className="brand-field min-h-28 w-full resize-none rounded-xl px-4 py-3 text-sm font-bold leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

function SelectInput({
  label,
  onChange,
  options,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  value: string;
}) {
  return (
    <FieldShell label={label} required={required}>
      <select
        className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold text-slate-800 outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function NumberInput({
  disabled = false,
  hint,
  label,
  min,
  onChange,
  suffix,
  value,
}: {
  disabled?: boolean;
  hint?: string;
  label: string;
  min?: number;
  onChange: (value: number) => void;
  suffix?: string;
  value: number;
}) {
  return (
    <FieldShell hint={hint} label={label}>
      <div className="brand-field flex h-12 items-center rounded-xl px-4">
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={disabled}
          min={min}
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix ? <span className="ml-3 text-xs font-black uppercase tracking-[0.08em] text-slate-400">{suffix}</span> : null}
      </div>
    </FieldShell>
  );
}

function SwitchField({
  checked,
  label,
  onChange,
  text,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
  text: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm shadow-slate-900/[0.03] transition hover:border-blue-200 hover:bg-blue-50/40"
      onClick={() => onChange(!checked)}
    >
      <span>
        <span className="block text-sm font-black text-slate-950">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-slate-500">{text}</span>
      </span>
      <span
        className={cn(
          "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition",
          checked ? "bg-blue-600" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-white shadow-sm transition",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

function PreviewStep({
  brandLogo,
  brandName,
  category,
  form,
  locations,
  selectedTitle,
}: {
  brandLogo: string | null;
  brandName: string;
  category: TemplateId;
  form: ChallengeFormState;
  locations: BrandLocationOption[];
  selectedTitle: string | null;
}) {
  if (locations) {
    const mechanic = mechanicOptions[category].find((item) => item.value === form.mechanicType)?.label ?? "Механика не выбрана";
    const rewardLimit = form.rewardUnlimited || form.rewardLimit === null ? "Без лимита" : `${form.rewardLimit} шт.`;
    return (
      <div className="grid items-center gap-8 xl:grid-cols-[minmax(280px,0.8fr)_minmax(378px,1fr)] xl:gap-14">
        <div className="space-y-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">Шаг 3</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Предпросмотр челленджа</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">Проверьте, как челлендж будет выглядеть для пользователя перед сохранением или публикацией.</p>
          </div>
          <Card className="p-5">
            <h3 className="font-black text-slate-950">Что проверяем</h3>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
              <li>Название и описание</li><li>Награду и баллы</li><li>Период выполнения и выбранные точки</li><li>Промо-изображение в верхней части карточки</li>
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="font-black text-slate-950">Сводка</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div><dt className="text-xs font-bold text-slate-400">Категория</dt><dd className="mt-1 font-black text-slate-800">{selectedTitle ?? templateTitles[category]}</dd></div>
              <div><dt className="text-xs font-bold text-slate-400">Механика</dt><dd className="mt-1 font-black text-slate-800">{mechanic}</dd></div>
              <div><dt className="text-xs font-bold text-slate-400">Награда</dt><dd className="mt-1 font-black text-slate-800">{form.rewardTitle || "Будет указана позже"}</dd></div>
              <div><dt className="text-xs font-bold text-slate-400">Баллы</dt><dd className="mt-1 font-black text-slate-800">{form.rewardCoins}</dd></div>
              <div><dt className="text-xs font-bold text-slate-400">Точки</dt><dd className="mt-1 font-black text-slate-800">{getSelectedLocationsText(form.selectedLocationIds.length)}</dd></div>
              <div><dt className="text-xs font-bold text-slate-400">Лимит</dt><dd className="mt-1 font-black text-slate-800">{rewardLimit}</dd></div>
            </dl>
          </Card>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm font-bold leading-6 text-blue-800">Если всё выглядит корректно, переходите к публикации. Если нужно что-то поправить — вернитесь назад.</div>
        </div>
        <motion.div initial={{ opacity: 0, x: 48, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.32, ease: "easeOut" }} className="flex justify-center xl:justify-start">
          <PhoneFrame className="mx-auto" resetKey={`${form.title}-${form.heroImageUrl ?? "fallback"}`}>
            <ChallengeDetailScreen challenge={buildPreviewChallenge({ brandLogo, brandName, category, form })} locations={toPreviewLocations(locations, form.selectedLocationIds)} isPreview />
          </PhoneFrame>
        </motion.div>
      </div>
    );
  }

  return (
    <PlaceholderShell
      icon={Eye}
      eyebrow="Шаг 3"
      title="Предпросмотр"
      text="Здесь будет предпросмотр того, как челлендж увидит пользователь в приложении."
    >
      <div className="mx-auto max-w-sm rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-900/12">
        <div className="rounded-[1.5rem] bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{brandName}</span>
            <Badge variant="success">Черновик</Badge>
          </div>
          <div className="mt-5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-black text-slate-950">Новый челлендж</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Шаблон: {selectedTitle ?? "не выбран"}. Детали появятся после настройки условий.
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/5 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    </PlaceholderShell>
  );
}

function PublishStepActual({ draftSaved, selectedTitle, locationScope }: { draftSaved: boolean; selectedTitle: string | null; locationScope?: { mode: "EXTENDED" | "FLAGSHIP"; locationName: string } }) {
  return (
    <>
      {locationScope ? <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-blue-800">{locationScope.mode === "EXTENDED" ? "После отправки основной кабинет бренда должен подтвердить челлендж. До этого пользователи его не увидят." : `Челлендж будет создан только для точки: ${locationScope.locationName}.`}</div> : null}
    <Card className="overflow-hidden p-0">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[280px_1fr] lg:p-8">
        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm shadow-blue-900/5"><Rocket className="h-6 w-6" /></span>
          <div className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-blue-500">Шаг 4</div>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Публикация</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Сохраните кампанию как черновик, назначьте дату или опубликуйте её для пользователей.</p>
        </div>
        <div className="grid gap-4 self-center md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-black text-slate-950"><Check className="h-5 w-5 text-emerald-600" />Проверка завершена</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">Шаблон: {selectedTitle ?? "не выбран"}. Данные, награда, период и точки будут сохранены за вашим брендом.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
            <div className="flex items-center gap-2 text-sm font-black text-violet-900"><CalendarClock className="h-5 w-5" />Гибкий запуск</div>
            <p className="mt-2 text-sm leading-6 text-violet-800/75">{draftSaved ? "Черновик уже сохранён в базе данных." : "Можно сохранить черновик, опубликовать сразу или выбрать дату и время запуска."}</p>
          </div>
        </div>
      </div>
    </Card>
    </>
  );
}

// Legacy presentation is retained for comparison while the new publish flow is active above.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PublishStep({ draftSaved, selectedTitle }: { draftSaved: boolean; selectedTitle: string | null }) {
  return (
    <PlaceholderShell
      icon={Save}
      eyebrow="Шаг 4"
      title="Публикация"
      text="Финальный шаг перед сохранением черновика или публикацией челленджа."
    >
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-black text-slate-950">Демо-режим</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Настоящая публикация отключена. Можно сохранить локальный черновик-состояние, чтобы показать финальный сценарий.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
            Шаблон: {selectedTitle ?? "не выбран"}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
          <Check className="h-6 w-6 text-emerald-600" />
          <div className="mt-3 text-sm font-black text-emerald-800">
            {draftSaved ? "Черновик сохранён" : "Готово к черновику"}
          </div>
          <p className="mt-2 text-sm leading-6 text-emerald-700/80">
            Нажмите «Сохранить черновик», чтобы показать успешное завершение без отправки данных.
          </p>
        </div>
      </div>
    </PlaceholderShell>
  );
}

function PlaceholderShell({
  children,
  eyebrow,
  icon: Icon,
  text,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  icon: LucideIcon;
  text: string;
  title: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[280px_1fr] lg:p-8">
        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm shadow-blue-900/5">
            <Icon className="h-6 w-6" />
          </div>
          <div className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-blue-500">{eyebrow}</div>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
        </div>
        <div className="min-w-0 self-center">{children}</div>
      </div>
    </Card>
  );
}
