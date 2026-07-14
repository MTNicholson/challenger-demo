"use client";

import { useRouter } from "next/navigation";

export function DeleteChallengeButton({ id }: { id: string }) {
  const router = useRouter();
  async function remove() {
    const word = window.prompt("Введите УДАЛИТЬ, чтобы безвозвратно удалить челлендж вместе со связанными тестовыми данными.");
    if (word !== "УДАЛИТЬ") return;
    const response = await fetch(`/api/admin/challenges/${id}/delete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmWord: word }) });
    const data = await response.json().catch(() => null) as { error?: string } | null;
    if (!response.ok) { window.alert(data?.error ?? "Не удалось удалить челлендж."); return; }
    router.push("/adminconsole/challenges");
    router.refresh();
  }
  return <button className="adminButton danger" type="button" onClick={remove}>Удалить навсегда</button>;
}
