import { ReactNode } from "react";
import { UserAppLayout } from "@/components/user/user-app-layout";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <div className="min-h-0 flex-1"><UserAppLayout>{children}</UserAppLayout></div>;
}
