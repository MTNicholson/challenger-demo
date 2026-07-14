import type { ReactNode } from "react";
import Link from "next/link";
import "./admin.css";
const items = [["Dashboard","/adminconsole"],["Бренды","/adminconsole/brands"],["Челленджи","/adminconsole/challenges"],["Пользователи","/adminconsole/users"],["Точки","/adminconsole/locations"],["Журнал действий","/adminconsole/audit"]];
export default function AdminLayout({ children }: { children: ReactNode }) { return <div className="adminRoot">{children}</div>; }
export function AdminShell({ children, title }: { children: ReactNode; title: string }) { return <div className="adminShell"><aside className="adminSide"><div className="adminLogo">ЧЕЛЛЕНДЖЕР · ADMIN</div><nav className="adminNav">{items.map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav></aside><div className="adminMain"><header className="adminTop"><strong>{title}</strong><form action="/api/admin/logout" method="post"><button className="adminButton secondary" type="submit">Выйти</button></form></header><main className="adminContent">{children}</main></div></div>; }
