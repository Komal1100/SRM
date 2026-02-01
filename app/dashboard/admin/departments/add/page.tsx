import { getManagers } from "@/app/action/departments/departmentActions";
import DepartmentForm from "../DepartmnetForm";

export default async function AddDepartmentPage() {
  const managers = await getManagers();

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Add Department</h1>
      <DepartmentForm managers={managers} />
    </>
  );
}
