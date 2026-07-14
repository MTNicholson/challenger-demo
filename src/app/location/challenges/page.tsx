import { redirect } from "next/navigation";
import { LocationChallengesClient } from "@/components/location/location-campaigns-client";
import { getCurrentLocationSession } from "@/lib/auth-server";
import { routes } from "@/lib/routes";
export default async function LocationChallenges() { const session=await getCurrentLocationSession(); if(!session) redirect("/brand/auth/login?mode=location"); if(session.user.role!=="LOCATION_ADMIN"||session.location.mode==="STANDARD") redirect(routes.location.dashboard); return <LocationChallengesClient mode={session.location.mode}/>; }
