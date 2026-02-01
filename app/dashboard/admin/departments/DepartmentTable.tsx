"use client";

import { toggleDepartmentStatus } from "@/app/action/departments/departmentActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DepartmentTable({ departments }: { departments: any[] }) {
  if (!departments.length) {
    return (
      <div className="text-muted-foreground text-center py-10">
        No departments found
      </div>
    );
  }
  console.log(departments)

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">Campus</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr key={dept.ServiceDeptID} className="border-t">
              <td className="px-4 py-3 font-medium">
                {dept.ServiceDeptName}
              </td>

              <td className="px-4 py-3">
                {dept.staff?.user?.Username ?? "—"}
              </td>

              <td className="px-4 py-3">
                {dept.CampusID}
              </td>

              <td className="px-4 py-3">
                {dept.IsActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </td>

              <td className="px-4 py-3 text-right space-x-2">
                <Link href={`/dashboard/admin/departments/${dept.ServiceDeptID}/edit`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    toggleDepartmentStatus({
                      id: dept.ServiceDeptID,
                      isActive: dept.IsActive,
                    })
                  }
                >
                  {dept.IsActive ? "Disable" : "Enable"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
