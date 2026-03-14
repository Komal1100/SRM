export default function StatCard({
  title,
  value,
  color = "blue"
}: {
  title: string
  value: number
  color?: "blue" | "green" | "red" | "yellow"
}) {

  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700"
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-center justify-between mt-2">
        <h3 className="text-2xl font-bold">{value}</h3>

        <div className={`px-2 py-1 text-xs rounded ${colors[color]}`}>
          Active
        </div>
      </div>
    </div>
  )
}
