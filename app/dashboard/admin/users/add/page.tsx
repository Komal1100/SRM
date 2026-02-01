import { getDepartments } from "@/app/action/departments/getDepartmentList";
import AddUserForm from "../AddEditUserForm";

export default async function AddUserPage() {
  const departments = await getDepartments();

  return (
    <AddUserForm departments={departments} />
  );
}
