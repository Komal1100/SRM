import { getDepartments } from "@/app/action/departments/getDepartmentList";
import { getAuthUser } from "@/app/lib/authUser";
import UserTable from "./UserTable";
import { getUsers } from "@/app/action/users/getUsers";

export default async function UsersPage(){
    const departments = await getDepartments();
    const user = await getAuthUser();

    if(!user || (user.roles[0]!="ADMIN" && user.roles[0]!="MANAGER")){
        throw new Error("Unauthorized")
    }



    return (
        <>
        <h1>Users List Page</h1>
        <UserTable departments={departments.map(d=>d.ServiceDeptName)} currentRole={user.roles[0]} />
        </>

    );
}