"use server";

import { prisma } from "@/app/lib/prisma";


export async function getEligibleTechnicians(requestId: number) {
  const request = await prisma.servicerequest.findUnique({
    where: { ServiceRequestID: requestId },
    include: {
      servicerequesttype: {
        include: {
          servicedept: true
        }
      }
    }
  });

  if (!request) throw new Error("Request not found");

  const today = new Date();

  // 2️⃣ Check type-wise technicians
  const typeWise = await prisma.servicerequesttypewiseperson.findMany({
    where: {
      ServiceRequestTypeID: request.ServiceRequestTypeID,
      FromDate: { lte: today },
      OR: [{ ToDate: null }, { ToDate: { gte: today } }],
      staff: {
        IsActive: true,
        user: {
          userroles: {
            some: {
              role: { RoleCode: "TECHNICIAN" }
            }
          }
        }
      }
    },
    include: { staff: true }
  });

  if (typeWise.length > 0) {
    return typeWise.map(t => t.staff);
  }

  // 3️⃣ Fallback: department-wise technicians
  const deptWise = await prisma.servicedeptperson.findMany({
    where: {
      ServiceDeptID: request.servicerequesttype.ServiceDeptID,
      FromDate: { lte: today },
      OR: [{ ToDate: null }, { ToDate: { gte: today } }],
      staff: {
        IsActive: true,
        user: {
          userroles: {
            some: {
              role: { RoleCode: "TECHNICIAN" }
            }
          }
        }
      }
    },
    include: { staff: true }
  });

  return deptWise.map(d => d.staff);
}
