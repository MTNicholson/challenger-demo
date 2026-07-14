import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../../layout";

export default async function BrandDetail({ params }: PageProps<"/adminconsole/brands/[id]">) {
  if (!(await getCurrentAdmin())) redirect("/adminconsole/login");
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id }, include: { members: true, locations: true, challenges: true } });
  if (!brand) notFound();
  return <AdminShell title="Карточка бренда"><div className="adminCard"><h1 className="adminTitle">{brand.name}</h1><p className="adminMuted">{brand.category} · {brand.city} · {brand.members[0]?.email}</p><p style={{ marginTop: 12 }}>{brand.description ?? "Описание не заполнено."}</p><div className="adminActions" style={{ marginTop: 18 }}>{brand.status === "pending" ? <form action={`/api/admin/brands/${brand.id}/approve`} method="post"><button className="adminButton">Подтвердить бренд</button></form> : null}{brand.status !== "blocked" ? <form action={`/api/admin/brands/${brand.id}/block`} method="post"><button className="adminButton danger">Заблокировать</button></form> : null}<span><b className={`adminBadge ${brand.status}`}>Модерация: {brand.status}</b></span><span><b className={`adminBadge ${brand.publicStatus === "ONLINE" ? "active" : "archived"}`}>Публичный статус: {brand.publicStatus === "ONLINE" ? "Активен" : "Не активен"}</b></span></div>{brand.status === "approved" && brand.publicStatus === "OFFLINE" ? <p className="adminMuted" style={{ marginTop: 12 }}>Бренд подтверждён. Он сможет стать видимым пользователям после запуска из кабинета бренда.</p> : null}</div><div className="adminSectionGrid" style={{ marginTop: 18 }}><div className="adminCard"><h2>Точки · {brand.locations.length}</h2>{brand.locations.map((location) => <p key={location.id} className="adminMuted">{location.name ?? "Точка"} · {location.address}</p>)}</div><div className="adminCard"><h2>Челленджи · {brand.challenges.length}</h2>{brand.challenges.map((challenge) => <p key={challenge.id}><Link className="adminLink" href={`/adminconsole/challenges/${challenge.id}`}>{challenge.title}</Link></p>)}</div></div></AdminShell>;
}
