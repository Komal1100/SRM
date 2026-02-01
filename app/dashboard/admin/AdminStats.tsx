// const stats = [
//   { label: "Pending", count: 12 },
//   { label: "Assigned", count: 8 },
//   { label: "Escalated", count: 2 },
//   { label: "In Progress", count: 5 },
// ];

// export default function AdminStats() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {stats.map((item) => (
//         <div
//           key={item.label}
//           className="bg-white shadow rounded p-4"
//         >
//           <p className="text-sm text-gray-500">{item.label}</p>
//           <p className="text-2xl font-bold">{item.count}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import { getAdminStats } from "@/app/action/admin/dashboard";
import Stat from "../components/Stat";

export default async function AdminStats({
  user,
  role,
}: {
  user: any;
  role: "ADMIN" | "MANAGER";
}) {
  const stats = await getAdminStats({
    userId: user.userId,
    role,
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      <Stat label="Total Requests" value={stats.total} />
      <Stat label="Open" value={stats.open} />
      <Stat label="Unassigned" value={stats.unassigned} />
      <Stat label="Closed" value={stats.closed} />
    </div>
  );
}
