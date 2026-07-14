"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Archive, Gift, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import {
  editableRewardStatuses,
  rewardStatusLabels,
  rewardTypeLabels,
  rewardTypes,
  type BrandRewardDto,
  type BrandRewardStatus,
  type BrandRewardType,
} from "@/lib/brand-rewards";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type RewardFormState = {
  id?: string;
  title: string;
  type: BrandRewardType;
  description: string;
  status: Exclude<BrandRewardStatus, "archived">;
  limit: number;
  unlimited: boolean;
  points: number;
  expiresInDays: string;
  usageTerms: string;
};

const emptyForm: RewardFormState = {
  title: "",
  type: "gift",
  description: "",
  status: "active",
  limit: 500,
  unlimited: false,
  points: 200,
  expiresInDays: "15",
  usageTerms: "",
};

const exampleRewards: Array<Pick<RewardFormState, "title" | "type" | "description" | "limit" | "points" | "usageTerms">> = [
  {
    title: "Напиток на выбор",
    type: "gift",
    description: "Любой напиток на выбор в сети Coffee Lover",
    limit: 500,
    points: 200,
    usageTerms: "Покажите QR-код сотруднику. Награда действует один раз.",
  },
  {
    title: "Скидка 15%",
    type: "discount",
    description: "Скидка 15% на следующий заказ",
    limit: 0,
    points: 100,
    usageTerms: "Скидка применяется к одному заказу.",
  },
  {
    title: "Десерт в подарок",
    type: "gift",
    description: "Фирменный десерт при следующем визите",
    limit: 300,
    points: 150,
    usageTerms: "Награда активируется после выполнения условий челленджа.",
  },
];

const statusVariant: Record<BrandRewardStatus, BadgeVariant> = {
  active: "success",
  draft: "neutral",
  archived: "warning",
};

export function BrandRewardsClient({
  archivedRewards: initialArchivedRewards,
  apiBase = "/api/brand/rewards",
  brandName,
  rewards: initialRewards,
}: {
  archivedRewards: BrandRewardDto[];
  apiBase?: string;
  brandName: string;
  rewards: BrandRewardDto[];
}) {
  const [rewards, setRewards] = useState(initialRewards);
  const [archivedRewards, setArchivedRewards] = useState(initialArchivedRewards);
  const [form, setForm] = useState<RewardFormState>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalIssued = rewards.reduce((sum, reward) => sum + reward.issuedCount, 0);
  const totalRedeemed = rewards.reduce((sum, reward) => sum + reward.redeemedCount, 0);
  const activeRewards = rewards.filter((reward) => reward.status === "active").length;

  async function loadRewards() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [mainResponse, archiveResponse] = await Promise.all([
        fetch(apiBase, { cache: "no-store" }),
        fetch(`${apiBase}?status=archived`, { cache: "no-store" }),
      ]);
      const mainData = (await mainResponse.json().catch(() => null)) as { rewards?: BrandRewardDto[]; error?: string } | null;
      const archiveData = (await archiveResponse.json().catch(() => null)) as { rewards?: BrandRewardDto[]; error?: string } | null;

      if (!mainResponse.ok || !archiveResponse.ok) {
        throw new Error(mainData?.error ?? archiveData?.error ?? "Не удалось загрузить награды");
      }

      setRewards(mainData?.rewards ?? []);
      setArchivedRewards(archiveData?.rewards ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось загрузить награды");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setForm(emptyForm);
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(reward: BrandRewardDto) {
    setForm({
      id: reward.id,
      title: reward.title,
      type: reward.type,
      description: reward.description,
      status: reward.status === "archived" ? "draft" : reward.status,
      limit: reward.limit ?? 500,
      unlimited: reward.limit === null,
      points: reward.points,
      expiresInDays: reward.expiresInDays === null ? "challenge_end" : String(reward.expiresInDays),
      usageTerms: reward.usageTerms ?? "",
    });
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsFormOpen(true);
  }

  function formPayload() {
    return {
      title: form.title.trim() || "Новая награда",
      type: form.type,
      description: form.description.trim() || "Описание награды появится здесь.",
      status: form.status,
      limit: form.unlimited ? null : form.limit,
      points: form.points,
      expiresInDays: form.expiresInDays === "challenge_end" ? null : Number(form.expiresInDays),
      usageTerms: form.usageTerms.trim() || "Покажите QR-код сотруднику. Награда действует один раз.",
    };
  }

  async function saveReward() {
    setSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch(form.id ? `${apiBase}/${form.id}` : apiBase, {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload()),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) throw new Error(data?.error ?? "Не удалось сохранить награду");

      setSuccessMessage(form.id ? "Награда обновлена" : "Награда создана");
      setIsFormOpen(false);
      await loadRewards();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось сохранить награду");
    } finally {
      setSaving(false);
    }
  }

  async function archiveReward(id: string) {
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiBase}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive" }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) throw new Error(data?.error ?? "Не удалось архивировать награду");

      setSuccessMessage("Награда перемещена в архив");
      await loadRewards();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось архивировать награду");
    }
  }

  async function deleteArchivedReward(id: string) {
    if (!window.confirm("Удалить награду окончательно? Это действие нельзя отменить.")) return;
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) throw new Error(data?.error ?? "Не удалось удалить награду");

      setSuccessMessage("Награда удалена");
      await loadRewards();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось удалить награду");
    }
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-bold text-blue-700">{brandName} · награды</div>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-[-0.025em] text-slate-950">Награды</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Создавайте шаблоны наград, используйте их в челленджах и отслеживайте выдачу.
          </p>
        </div>
        <Button className="rounded-lg" variant="secondary" onClick={() => setIsArchiveOpen(true)}>
          <Archive className="h-4 w-4" />
          Архив
        </Button>
      </header>

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Всего наград" value={rewards.length} />
        <KpiCard label="Активные" value={activeRewards} />
        <KpiCard label="Выдано" value={totalIssued} />
        <KpiCard label="Использовано" value={totalRedeemed} />
      </section>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Список наград</h2>
            <p className="mt-1 text-sm text-slate-500">Шаблоны, которые можно использовать в новых челленджах.</p>
          </div>
          <Button className="rounded-lg" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            Создать награду
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">Загружаем награды...</div>
        ) : rewards.length ? (
          <RewardTable rewards={rewards} onArchive={archiveReward} onEdit={openEditForm} />
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-950">Пока нет созданных наград</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Создайте первую награду, чтобы затем использовать её в челленджах.
            </p>
            <Button className="mt-5 rounded-lg" onClick={openCreateForm}>
              Создать награду
            </Button>
          </div>
        )}
      </Card>

      {isFormOpen ? (
        <RewardFormModal
          form={form}
          saving={saving}
          onChange={setForm}
          onClose={() => setIsFormOpen(false)}
          onSave={saveReward}
        />
      ) : null}
      {isArchiveOpen ? (
        <ArchiveModal
          rewards={archivedRewards}
          onClose={() => setIsArchiveOpen(false)}
          onDelete={deleteArchivedReward}
        />
      ) : null}
    </main>
  );
}

function RewardTable({
  onArchive,
  onEdit,
  rewards,
}: {
  onArchive: (id: string) => void;
  onEdit: (reward: BrandRewardDto) => void;
  rewards: BrandRewardDto[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="brand-table-card w-full min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="px-5 py-4">Название</th>
            <th className="px-5 py-4">Тип</th>
            <th className="px-5 py-4">Статус</th>
            <th className="px-5 py-4">Лимит</th>
            <th className="px-5 py-4">Выдано</th>
            <th className="px-5 py-4">Использовано</th>
            <th className="px-5 py-4">Баллы</th>
            <th className="px-5 py-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward.id} className="border-t border-slate-100">
              <td className="px-5 py-4">
                <div className="font-black text-slate-950">{reward.title}</div>
                <div className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{reward.description}</div>
              </td>
              <td className="px-5 py-4 font-bold text-slate-600">{rewardTypeLabels[reward.type]}</td>
              <td className="px-5 py-4">
                <Badge variant={statusVariant[reward.status]}>{rewardStatusLabels[reward.status]}</Badge>
              </td>
              <td className="px-5 py-4 font-bold text-slate-600">{reward.limit === null ? "Без лимита" : reward.limit}</td>
              <td className="px-5 py-4 font-black text-slate-950">{reward.issuedCount}</td>
              <td className="px-5 py-4 font-black text-slate-950">{reward.redeemedCount}</td>
              <td className="px-5 py-4 font-black text-blue-700">{reward.points}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(reward)}>
                    <Pencil className="h-4 w-4" />
                    Редактировать
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onArchive(reward.id)}>
                    <Archive className="h-4 w-4" />
                    Архивировать
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-bold text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value.toLocaleString("ru-RU")}</div>
    </Card>
  );
}

function RewardFormModal({
  form,
  onChange,
  onClose,
  onSave,
  saving,
}: {
  form: RewardFormState;
  onChange: (form: RewardFormState) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  function update<K extends keyof RewardFormState>(field: K, value: RewardFormState[K]) {
    onChange({ ...form, [field]: value });
  }

  function applyExample(example: (typeof exampleRewards)[number]) {
    onChange({
      ...form,
      ...example,
      unlimited: example.limit === 0,
      limit: example.limit || 500,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <div className="text-sm font-bold text-blue-700">Шаблон награды</div>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {form.id ? "Редактировать награду" : "Создать награду"}
            </h2>
          </div>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <Field label="Название награды">
              <input className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold outline-none" placeholder="Напиток на выбор" value={form.title} onChange={(event) => update("title", event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Тип награды">
                <select className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold outline-none" value={form.type} onChange={(event) => update("type", event.target.value as BrandRewardType)}>
                  {rewardTypes.map((value) => (
                    <option key={value} value={value}>{rewardTypeLabels[value]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Статус">
                <select className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold outline-none" value={form.status} onChange={(event) => update("status", event.target.value as RewardFormState["status"])}>
                  {editableRewardStatuses.map((value) => (
                    <option key={value} value={value}>{rewardStatusLabels[value]}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Описание награды">
              <textarea className="brand-field min-h-24 w-full resize-none rounded-xl px-4 py-3 text-sm font-bold leading-6 outline-none" placeholder="Любой напиток на выбор в сети Coffee Lover" value={form.description} onChange={(event) => update("description", event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Лимит наград">
                <input className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold outline-none disabled:cursor-not-allowed disabled:text-slate-400" disabled={form.unlimited} min={0} type="number" value={form.limit} onChange={(event) => update("limit", Number(event.target.value))} />
              </Field>
              <label className="flex items-center gap-3 self-end rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                <input className="h-4 w-4 accent-blue-600" checked={form.unlimited} type="checkbox" onChange={(event) => update("unlimited", event.target.checked)} />
                Без лимита
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Количество баллов" hint="Сколько баллов пользователь получит или потратит в связке с этой наградой.">
                <input className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold outline-none" min={0} type="number" value={form.points} onChange={(event) => update("points", Number(event.target.value))} />
              </Field>
              <Field label="Срок действия после получения">
                <select className="brand-field h-12 w-full rounded-xl px-4 text-sm font-bold outline-none" value={form.expiresInDays} onChange={(event) => update("expiresInDays", event.target.value)}>
                  <option value="7">7 дней</option>
                  <option value="15">15 дней</option>
                  <option value="30">30 дней</option>
                  <option value="challenge_end">До конца челленджа</option>
                </select>
              </Field>
            </div>
            <Field label="Условия использования">
              <textarea className="brand-field min-h-24 w-full resize-none rounded-xl px-4 py-3 text-sm font-bold leading-6 outline-none" placeholder="Покажите QR-код сотруднику. Награда действует один раз." value={form.usageTerms} onChange={(event) => update("usageTerms", event.target.value)} />
            </Field>
          </div>

          <aside className="self-start rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-blue-800">
              <Sparkles className="h-4 w-4" />
              Совет
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Лучше всего работают простые и понятные награды: напиток на выбор, скидка на следующий визит, подарок за серию действий или бонусные баллы.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {exampleRewards.map((example) => (
                <button key={example.title} className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-black text-blue-700 transition hover:bg-blue-50" type="button" onClick={() => applyExample(example)}>
                  {example.title}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 sm:flex-row sm:justify-end">
          <Button className="rounded-lg" variant="secondary" onClick={onClose}>Отмена</Button>
          <Button className="rounded-lg" disabled={saving} onClick={onSave}>
            {saving ? "Сохраняем..." : "Сохранить награду"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ArchiveModal({
  onClose,
  onDelete,
  rewards,
}: {
  onClose: () => void;
  onDelete: (id: string) => void;
  rewards: BrandRewardDto[];
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <div className="text-sm font-bold text-blue-700">Архив</div>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Архив наград</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Здесь хранятся награды, которые больше не используются в новых челленджах.
            </p>
          </div>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {rewards.length ? (
          <div className="space-y-3 p-5">
            {rewards.map((reward) => (
              <div key={reward.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-950">{reward.title}</h3>
                      <Badge variant="warning">Архив</Badge>
                      <Badge>{rewardTypeLabels[reward.type]}</Badge>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{reward.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      <span>Лимит: {reward.limit === null ? "без лимита" : reward.limit}</span>
                      <span>Баллы: {reward.points}</span>
                      <span>Выдано: {reward.issuedCount}</span>
                      <span>Использовано: {reward.redeemedCount}</span>
                      <span>Архив: {formatDate(reward.archivedAt ?? reward.updatedAt)}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(reward.id)}>
                    <Trash2 className="h-4 w-4" />
                    Удалить окончательно
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              <Archive className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-950">Архив пуст</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Архивированные награды появятся здесь.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(new Date(value));
}

function Field({ children, hint, label }: { children: ReactNode; hint?: string; label: string }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-2 block text-xs leading-5 text-slate-400">{hint}</span> : null}
    </label>
  );
}
