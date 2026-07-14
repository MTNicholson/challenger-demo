import { redirect } from "next/navigation";
import { getCurrentLocationSession } from "@/lib/auth-server";
import { LocationShell } from "@/components/location/location-shell";
export default async function LocationLayout({ children }: { children: React.ReactNode }) { const session = await getCurrentLocationSession(); if (!session) redirect("/brand/auth/login?mode=location"); return <LocationShell brandName={session.brand.name} locationName={session.location.name ?? "Точка бренда"} address={session.location.fullAddress ?? session.location.address} mode={session.location.mode} role={session.user.role}>{children}</LocationShell>; }
