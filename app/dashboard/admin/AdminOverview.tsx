import Link from "next/link";
import IncomingRequests from "./IncomingRequests";
import AdminStats from "./AdminStats";
import { hasPermission } from "@/app/lib/permission";

export default function AdminOverview({ user }: { user: any }) {
  const role = user.roles.includes("ADMIN")
    ? "ADMIN"
    : user.roles.includes("MANAGER")
      ? "MANAGER"
      : null;

  if (!role) return null;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold"> {role === "ADMIN" ? "Admin Dashboard" : "Manager Dashboard"}
        </h1>

       {hasPermission(user, "USER_MANAGE") && (
          <Link
            href="/dashboard/admin/users/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add User
          </Link>
        )}
      </div>

      <AdminStats user={user} role={role}/>
      <IncomingRequests />
    </div>
  );
}
