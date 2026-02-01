"use server";

import { prisma } from "../lib/prisma";



export async function getManagedDepartments(
  userId: number
): Promise<number[]> {
  // Step 1: Get StaffID for this user
  const staff = await prisma.staff.findFirst({
    where: {
      UserID: userId,
      IsActive: true,
    },
    select: {
      StaffID: true,
    },
  });

  if (!staff) {
    return [];
  }

  // Step 2: Get departments where this staff is HOD
  const departments = await prisma.servicedeptperson.findMany({
    where: {
      StaffID: staff.StaffID,
      IsHODStaff: true,
      OR: [
        { ToDate: null }, // still active
        { ToDate: { gt: new Date() } }, // valid till future
      ],
    },
    select: {
      ServiceDeptID: true,
    },
  });

  return departments.map((d) => d.ServiceDeptID);
}
