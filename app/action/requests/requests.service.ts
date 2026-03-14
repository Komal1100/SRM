'use server'
import { prisma } from "@/app/lib/prisma";
import { getManagedDepartments } from "../getManagedSept";
import { use } from "react";
import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import { connect } from "http2";
import { uploadFileToCloudinary } from "@/app/lib/cloudinary";

export async function getRequestsForUser(user: any) {
  let where: any = {};
  if (!user?.userId) {
    console.error("Error: user.UserID is missing", user);
    return [];
  }

  const role = user.roles[0]

  const User = await prisma.user.findUnique({
    where: {
      UserID: user.userId,
    },
    include: {
      staff: true
    }
  })

  if (role === "MANAGER") {
    const deptIds = await getManagedDepartments(user.userId);

    where = {
      servicerequesttype: {
        ServiceDeptID: { in: deptIds },
      },
    };
  } else

    if (role != "ADMIN") {
      where = {
        OR: [
          { UserID: user.userId },
          { AssignedToStaffID: User?.staff[0]?.StaffID }
        ]
      };
    }


  return prisma.servicerequest.findMany({
    where,
    include: {
      servicerequesttype: {
        include: { servicedept: true },
      },
      servicerequeststatus: true,
      staff_servicerequest_AssignedToStaffIDTostaff: true,
      user_servicerequest_UserIDTouser: {
        select: { Username: true }
      }
    },

    orderBy: { Created: "desc" },
  });
}



export async function raiseServiceRequest(formData: FormData) {
  const user = await getAuthUser()
  if (!user) throw new Error('Unauthorized')
  const staff = await prisma.staff.findFirst({
    where: { UserID: user.userId },
    select: { StaffID: true },
  })
  if (!hasPermission(user, 'SR_CREATE')) {
    throw new Error('Forbidden')
  }

  const ServiceRequestTypeID = Number(formData.get('ServiceRequestTypeID'))
  const ServiceRequestTitle = String(formData.get('ServiceRequestTitle'))
  const ServiceRequestDescription = String(
    formData.get('ServiceRequestDescription')
  )

  const pendingStatus = await prisma.servicerequeststatus.findFirst({
    where: { ServiceRequestStatusSystemName: 'PENDING' },
  })

  const file = formData.get('attachment') as File | null


  if (!pendingStatus) {
    throw new Error('PENDING status missing')
  }

  const now = new Date()

  let AttachmentPath: string | null = null
  let AttachmentFileOriginalName: string | null = null
  if (file && file.size > 0) {
    const uploadResult = await uploadFileToCloudinary(file, 'service-requests');
    AttachmentPath = uploadResult?.url ?? null;
    AttachmentFileOriginalName = file.name
  }


  await prisma.servicerequest.create({
    data: {
      ServiceRequestNo: `SR-${Date.now()}`,
      ServiceRequestDateTime: now,
      ServiceRequestTypeID,
      ServiceRequestTitle,
      ServiceRequestDescription,

      ServiceRequestStatusID: pendingStatus.ServiceRequestStatusID,
      ServiceRequestStatusDateTime: now,
      ServiceRequestStatusByUserID: user.userId,

      UserID: user.userId,
      RequestedByStaffID: staff?.StaffID ?? null,



      AttachmentPath,
      AttachmentFileOriginalName,

      Created: now,
      Modified: now,
    }
  })

}

