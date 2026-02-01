"use server";

import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import { prisma } from "@/app/lib/prisma";


export async function assignRequest(
  requestId: number,
  staffId: number,
  description?: string
) {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  if (!hasPermission(user, "SR_ASSIGN"))
    throw new Error("Forbidden");

  const assignedStatus = await prisma.servicerequeststatus.findFirst({
    where: { ServiceRequestStatusSystemName: "ASSIGNED" }
  });

  await prisma.$transaction([
    prisma.servicerequest.update({
      where: { ServiceRequestID: requestId },
      data: {
        AssignedToStaffID: staffId,
        AssignedByUserID: user.userId,
        ServiceRequestStatusID: assignedStatus!.ServiceRequestStatusID,
        Modified: new Date()
      }
    }),

    prisma.servicerequestassignmenthistory.create({
      data: {
        ServiceRequestID: requestId,
        AssignedToStaffID: staffId,
        AssignedByUserID: user.userId,
        AssignedDateTime: new Date(),
        Description: description
      }
    })
  ]);
}
