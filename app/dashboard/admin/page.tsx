import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import { redirect } from "next/navigation";
import AdminOverview from "./AdminOverview";

export default async function AdminPage() {
  const user = await getAuthUser();

  // Safety check
  if (!user) {
    redirect("/login");
  }

  // Only ADMIN or MANAGER can access admin dashboard
  if (
    !hasPermission(user, "SR_VIEW_ALL") &&
    !hasPermission(user, "USER_MANAGE")
  ) {
    redirect("/dashboard");
  }

  return <AdminOverview user={user} />;
}
