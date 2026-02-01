import { getDepartmentById, getManagers } from "@/app/action/departments/departmentActions";
import DepartmentForm from "../../DepartmnetForm";

export default async function EditDepartmentPage({ params } : {params : Promise<{id : string}>}) {
    const {id} = await params;
    console.log(id+ "In Parameter.....")
  const department = await getDepartmentById(Number(id));
  const managers = await getManagers();

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Edit Department</h1>
      <DepartmentForm department={department} managers={managers} />
    </>
  );
}
