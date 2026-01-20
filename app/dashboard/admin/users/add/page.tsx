import { getDepartments } from "@/app/action/getDepartmentList";
import AddUserForm from "./AddUserForm";

export default async function AddUserPage() {
  const departments = await getDepartments();

  return (
    <AddUserForm departments={departments} />
  );
}
