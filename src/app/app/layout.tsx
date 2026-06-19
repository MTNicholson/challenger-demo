import { ReactNode } from "react";
import { UserAppLayout } from "@/components/user/user-app-layout";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <UserAppLayout>{children}</UserAppLayout>;
}
