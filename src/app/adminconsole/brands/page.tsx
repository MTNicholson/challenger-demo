import { redirect } from "next/navigation";
import { AdminBrandList } from "@/components/admin/admin-brand-list";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminShell } from "../layout";

export default async function Brands() {
  if (!(await getCurrentAdmin())) redirect("/adminconsole/login");
  return <AdminShell title="Бренды"><h1 className="adminTitle">Бренды</h1><p className="adminMuted">Модерация и публичный статус компаний.</p><AdminBrandList /></AdminShell>;
}
