const stats = [
  { label: "Pending", count: 12 },
  { label: "Assigned", count: 8 },
  { label: "Escalated", count: 2 },
  { label: "In Progress", count: 5 },
];

export default function AdminStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white shadow rounded p-4"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-2xl font-bold">{item.count}</p>
        </div>
      ))}
    </div>
  );
}
