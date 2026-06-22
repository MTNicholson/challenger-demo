import { ReactNode } from "react";
import { Nunito_Sans } from "next/font/google";
import { UserAppLayout } from "@/components/user/user-app-layout";

const nunitoSans = Nunito_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <div className={`${nunitoSans.className} min-h-0 flex-1`}><UserAppLayout>{children}</UserAppLayout></div>;
}
