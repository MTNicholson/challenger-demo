import { ReactNode } from "react";
import { UserBottomNav } from "./user-bottom-nav";

type UserAppLayoutProps = {
  children: ReactNode;
};

export function UserAppLayout({ children }: UserAppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6f2ea] text-slate-950">
      <div className="mx-auto min-h-screen max-w-[460px] bg-gradient-to-b from-white via-[#f8f5ef] to-[#efe8dc] shadow-2xl shadow-slate-900/10">
        <div className="min-h-screen px-5 pb-28 pt-5">
          {children}
        </div>
      </div>

      <UserBottomNav />
    </div>
  );
}
