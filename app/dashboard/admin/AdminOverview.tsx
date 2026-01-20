import Link from "next/link";
import IncomingRequests from "./IncomingRequests";
import AdminStats from "./AdminStats";

export default function AdminOverview({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <Link
          href="dashboard/admin/users/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </Link>
      </div>

      <AdminStats />
      <IncomingRequests />
    </div>
  );
}
