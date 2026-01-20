"use server"
import { prisma } from "@/app/lib/prisma";

export const getDepartments = async () => {
  return await prisma.servicedept.findMany({
    select: {
      ServiceDeptID: true,
      ServiceDeptName: true,
    },
    orderBy: {
      ServiceDeptName: 'asc', 
    },
  });
};
