import { notFound, redirect } from "next/navigation";
import { DeleteChallengeButton } from "@/components/admin/delete-challenge-button";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../../layout";

export default async function ChallengeDetail({ params }: PageProps<"/adminconsole/challenges/[id]">) {
  if (!(await getCurrentAdmin())) redirect("/adminconsole/login");
  const { id } = await params;
  const challenge = await prisma.brandChallenge.findUnique({ where: { id }, include: { brand: true, participations: { include: { user: true, reward: true } } } });
  if (!challenge) notFound();
  return <AdminShell title="Карточка челленджа"><div className="adminCard"><div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"start"}}><div><h1 className="adminTitle">{challenge.title}</h1><p className="adminMuted">{challenge.brand.name} · {challenge.status || "Без статуса"} · создан {challenge.createdAt.toLocaleDateString("ru-RU")}</p></div><DeleteChallengeButton id={challenge.id}/></div><p style={{marginTop:12}}>{challenge.description}</p><p style={{marginTop:12}}><strong>Награда:</strong> {challenge.reward ?? "—"}</p></div><div className="adminCard" style={{marginTop:18}}><h2>Участники · {challenge.participations.length}</h2><table className="adminTable"><tbody>{challenge.participations.map((item)=><tr key={item.id}><td>{item.user.name}</td><td>{item.progressCurrent}/{item.progressTotal}</td><td>{item.status}</td><td>{item.reward ? "QR доступен" : "—"}</td></tr>)}</tbody></table></div></AdminShell>;
}
