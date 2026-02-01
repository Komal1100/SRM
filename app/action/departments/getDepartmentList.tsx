"use server"
import { prisma } from "@/app/lib/prisma";

export const getDepartments = async () => {
  return await prisma.servicedept.findMany({
    where: {
      IsActive: true

    },
    select: {
      ServiceDeptID: true,
      ServiceDeptName: true,
    },
    
    orderBy: {
      ServiceDeptName: 'asc',
    },
  });
};

export const getDepartmentswithManager = async () =>{
  return await prisma.servicedept.findMany({
    
    // select: {
    //   ServiceDeptID: true, 
    //   ServiceDeptName: true,
    //   staff: {
    //     select: {
    //       StaffID: true,
    //       user: {
    //         select: {
    //           Username: true 
    //         }
    //       }
    //     }
    //   }
    // },
    include: {
      staff: {
        include: { user: true }
      }
    },
    
    orderBy: {
      ServiceDeptName: 'asc',
    },
  });
}
