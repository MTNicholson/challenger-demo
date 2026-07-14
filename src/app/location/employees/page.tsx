import { redirect } from "next/navigation";
import { getCurrentLocationSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { EmployeesClient } from "./employees-client";
export default async function EmployeesPage(){const session=await getCurrentLocationSession();if(!session)redirect("/brand/auth/login?mode=location");if(session.user.role!=="LOCATION_ADMIN")redirect(routes.location.scanner);const employees=await prisma.locationUser.findMany({where:{locationId:session.location.id,role:"LOCATION_STAFF"},orderBy:{createdAt:"desc"},select:{id:true,name:true,email:true,status:true,lastLoginAt:true,createdAt:true}});return <div><h1 className="text-3xl font-black">Сотрудники</h1><p className="mt-2 text-slate-500">Управляйте доступом команды только этой точки.</p><div className="mt-6"><EmployeesClient initialEmployees={employees.map(item=>({...item,lastLoginAt:item.lastLoginAt?.toISOString()??null,createdAt:item.createdAt.toISOString()}))}/></div></div>}
