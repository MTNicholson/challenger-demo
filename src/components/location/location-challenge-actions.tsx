"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LocationChallengeActions({ id, status, mode = "FLAGSHIP" }: { id: string; status: string; mode?: "EXTENDED" | "FLAGSHIP" }) {
  const router = useRouter();
  async function update(next: "draft" | "active" | "archived") {
    const response = await fetch(`/api/location/challenges/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    const data = await response.json().catch(() => null) as { error?: string } | null;
    if (response.ok) router.refresh(); else window.alert(data?.error ?? "Не удалось изменить статус.");
  }
  async function remove() {
    if (!window.confirm("Удалить челлендж навсегда? Связанные тестовые участия и события будут очищены. Это действие нельзя отменить.")) return;
    const response = await fetch(`/api/location/challenges/${id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null) as { error?: string } | null;
    if (response.ok) router.push("/location/challenges"); else window.alert(data?.error ?? "Не удалось удалить челлендж.");
  }
  return <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => update(status === "active" ? "draft" : "active")}>{status === "active" ? "Вернуть в черновик" : mode === "EXTENDED" ? "Отправить на подтверждение" : "Запустить"}</Button>{mode === "FLAGSHIP" ? <Button variant="ghost" onClick={() => update("archived")}>Архивировать</Button> : null}<Button variant="ghost" onClick={remove}>Удалить навсегда</Button></div>;
}
