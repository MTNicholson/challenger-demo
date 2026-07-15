import { BrandLoginClient, type LoginMode } from "@/components/auth/brand-login-client";

export default async function BrandLoginPage({ searchParams }: PageProps<"/brand/auth/login">) {
  const query = await searchParams;
  const initialMode: LoginMode = query.mode === "location" ? "location" : "brand";
  return <BrandLoginClient initialMode={initialMode} pendingNotice={query.pending === "1"} />;
}
