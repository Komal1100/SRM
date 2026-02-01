import { getDepartmentswithManager } from "@/app/action/departments/getDepartmentList";
import DepartmentTable from "./DepartmentTable";

export default async function DepartmentPage() {
  const departments = await getDepartmentswithManager();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Departments</h1>

      <DepartmentTable departments={departments} />
    </div>
  );
}
