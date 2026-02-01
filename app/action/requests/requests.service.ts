import { prisma } from "@/app/lib/prisma";
import { getManagedDepartments } from "../getManagedSept";
import { use } from "react";
import { getAuthUser } from "@/app/lib/authUser";

export async function getRequestsForUser(user: any) {
  let where: any = {};

  const role = user.roles[0]

  if (role === "MANAGER") {
    const deptIds = await getManagedDepartments(user.userId);

    where = {
      servicerequesttype: {
        ServiceDeptID: { in: deptIds },
      },
    };
  } else

    if (role != "ADMIN") {
      where = {OR : [
        { UserID: user.UserID }, 
        { AssignedToStaffID: user.staff?.StaffID } 
      ]};
    }

  return prisma.servicerequest.findMany({
    where,
    include: {
      servicerequesttype: {
        include: { servicedept: true },
      },
      servicerequeststatus: true,
    },
    orderBy: { Created: "desc" },
  });
}
