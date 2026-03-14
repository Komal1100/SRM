import { getTechnicianDashboardData } from "@/app/action/technician/dashboard"
import StatCard from "../components/cards/StatCard"

export default async function TechnicianDashboardPage() {
  const data = await getTechnicianDashboardData()

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Overview of your assigned service requests
          </p>
        </div>

        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
          Technician
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard title="Assigned Today" value={data.assignedToday} />

        <StatCard
          title="In Progress"
          value={data.inProgress}
          color="yellow"
        />

        <StatCard
          title="Completed Today"
          value={data.completedToday}
          color="green"
        />

        <StatCard
          title="Overdue"
          value={data.overdue}
          color="red"
        />
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Recent Assigned Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr className="text-left">
                <Th>SR No</Th>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Created</Th>
                <Th></Th>
              </tr>
            </thead>

            <tbody>
              {data.recentRequests.map((req: any) => (
                <tr
                  key={req.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <Td>{req.number}</Td>

                  <Td className="font-medium">{req.title}</Td>

                  <Td>
                    <StatusBadge status={req.status} />
                  </Td>

                  <Td>
                    <PriorityBadge level={req.priority} />
                  </Td>

                  <Td>{req.createdAt}</Td>

                  <Td>
                    <a
                      href={`/technician/requests/${req.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View
                    </a>
                  </Td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}
