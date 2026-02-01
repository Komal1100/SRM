import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";

import UserOverview from "./user/UserOverview";
import TechnicianOverview from "./technician/TechnicianOverview";
import AdminOverview from "./admin/AdminOverview";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
 const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const roles = user.roles; // ['ADMIN', 'TECHNICIAN', ...]

  if (roles.includes("ADMIN") || roles.includes("MANAGER")) {
    redirect("/dashboard/admin");
  }

  if (roles.includes("TECHNICIAN")) {
    redirect("/dashboard/technician");
  }

  redirect("/dashboard/user");
}
