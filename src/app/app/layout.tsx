import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { UserAppLayout } from "@/components/user/user-app-layout";
import { getCurrentUser } from "@/lib/auth-server";
import { routes } from "@/lib/routes";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.auth.login);

  return <div className="min-h-0 flex-1"><UserAppLayout initialUser={user}>{children}</UserAppLayout></div>;
}
