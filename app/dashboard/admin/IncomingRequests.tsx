const requests = [
  {
    id: 1,
    srNo: "SR-001",
    title: "AC not working",
    dept: "Maintenance",
    status: "PENDING",
  },
  {
    id: 2,
    srNo: "SR-002",
    title: "Laptop issue",
    dept: "IT",
    status: "ESCALATED",
  },
];

export default function IncomingRequests() {
  return (
    <div className="bg-white shadow rounded">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          Incoming Requests (Action Required)
        </h2>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">SR No</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.srNo}</td>
              <td className="p-2">{r.title}</td>
              <td className="p-2">{r.dept}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
