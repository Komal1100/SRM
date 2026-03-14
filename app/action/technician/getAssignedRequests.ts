'use server'

import { getAuthUser } from "@/app/lib/authUser"
import { hasPermission, hasRole } from "@/app/lib/permission"
import { prisma } from "@/app/lib/prisma"
import { use } from "react"


export async function getAssignedRequests() {
  const user = await getAuthUser()
  hasPermission(user, 'SR_VIEW_OWN')

  if (hasRole(user , 'TECHNICIAN')) {
    throw new Error('Not a technician')
  }

  const Fuser = await prisma.user.findUnique({
    where:{
        UserID : user?.userId
    },
    include :{
        staff : true
    }
  })
  return prisma.servicerequest.findMany({
    where: {
      AssignedToStaffID: Fuser?.staff[0].StaffID,
    },
    include: {
      servicerequeststatus: true,
      servicerequesttype: true,
    },
    orderBy: {
      ServiceRequestDateTime: 'desc',
    },
  })
}
