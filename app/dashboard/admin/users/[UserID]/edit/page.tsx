import { getDepartments } from "@/app/action/departments/getDepartmentList";
import AddUserForm from "../../AddEditUserForm";
import { prisma } from "@/app/lib/prisma";

export default async function EditUserPage({ params }: { params: { UserID: string } }) {
    const param = await params;
    const UserID = Number(param.UserID);
    const departments = await getDepartments();

    const getuser = await prisma.user.findFirst({
        where: {
            UserID: UserID
        },
        include: {
            staff: {
                include: {
                    servicedeptperson: {
                        select: {
                            ServiceDeptID: true,
                        }
                    }
                }
            },
            userroles: {
                include: {
                    role: {
                        select: {
                            RoleCode: true
                        }
                    }
                }
            }
        },

    })

    if (!getuser) {
        throw new Error("User not found")
    }
    const user = {
        id: getuser.UserID,
        username: getuser.Username,
        email: getuser.Email,
        mobileNo: getuser.MobileNo,
        roleCode: getuser.userroles[0].role.RoleCode,
        staffInfo: getuser.staff?.length
            ? {
                staffCode: getuser.staff[0].StaffCode ?? "",
                designation: getuser.staff[0].Designation ?? "",
                department: getuser.staff[0].Department ?? "",
                serviceDeptID:
                    getuser.staff[0].servicedeptperson?.[0]?.ServiceDeptID ?? 0,
            }
            : undefined,
    }


    return (
        <AddUserForm departments={departments} user={user} />
    );
}



