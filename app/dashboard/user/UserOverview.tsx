import Link from "next/link";

export default function UserOverview({ user }: any) {
  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">
        My Dashboard
      </h2>

      <p className="text-sm text-gray-500">
        Welcome back, {user.username}
      </p>

      <div className="mt-4 flex gap-4">
        <Link
          href="/dashboard/requests/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create Request
        </Link>

        <Link
          href="/dashboard"
          className="px-4 py-2 border rounded"
        >
          View My Requests
        </Link>
      </div>
    </section>
  );
}
