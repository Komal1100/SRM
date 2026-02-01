"use server";

import { prisma } from "@/app/lib/prisma";
import { getManagedDepartments } from "../getManagedSept";

export async function getAdminStats({
  userId,
  role,
}: {
  userId: number;
  role: "ADMIN" | "MANAGER";
}) {
  let where: any = {};

  if (role === "MANAGER") {
    const deptIds = await getManagedDepartments(userId);


    where = {
      servicerequesttype: {
        ServiceDeptID: { in: deptIds },
      },
    };
  }

  const [total, open, unassigned, closed] = await Promise.all([
    prisma.servicerequest.count({ where }),
    prisma.servicerequest.count({
      where: { ...where, servicerequeststatus: { IsOpen: true } },
    }),
    prisma.servicerequest.count({
      where: { ...where, AssignedToStaffID: null },
    }),
    prisma.servicerequest.count({
      where: {
        ...where,
        servicerequeststatus: { IsNoFurtherActionRequired: true },
      },
    }),
  ]);

  console.log(total +" "+ open +" ");

  return { total, open, unassigned, closed };
}
