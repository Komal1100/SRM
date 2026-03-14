"use server"

import { getAuthUser } from "@/app/lib/authUser"
import { prisma } from "@/app/lib/prisma"


export async function getTechnicianDashboardData() {
  const user = await getAuthUser()

  if(!user){
    return {
      error: 'You must be signed in to perform this action',
      success: false,
    };
  }

  const staff = await prisma.staff.findFirst({
    where: { UserID: user.userId }
  })

  const assignedToday = await prisma.servicerequest.count({
    where: {
      AssignedToStaffID: staff?.StaffID,
      Created: {
        gte: new Date(new Date().setHours(0,0,0,0))
      }
    }
  })

  const inProgress = await prisma.servicerequest.count({
    where: {
      AssignedToStaffID: staff?.StaffID,
      servicerequeststatus: {
        ServiceRequestStatusSystemName: "IN_PROGRESS"
      }
    }
  })

  const completedToday = await prisma.servicerequest.count({
    where: {
      AssignedToStaffID: staff?.StaffID,
      servicerequeststatus: {
        ServiceRequestStatusSystemName: "COMPLETED"
      }
    }
  })

  const overdue = await prisma.servicerequest.count({
    where: {
      AssignedToStaffID: staff?.StaffID,
      ServiceRequestStatusID: { not: 5 }, // not closed
      Created: {
        lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    }
  })

  const recentRequests = await prisma.servicerequest.findMany({
    where: { AssignedToStaffID: staff?.StaffID },
    take: 5,
    orderBy: { Created: "desc" },
    include: {
      servicerequeststatus: true
    }
  })

  return {
    assignedToday,
    inProgress,
    completedToday,
    overdue,
    recentRequests: recentRequests.map(r => ({
      id: r.ServiceRequestID,
      number: r.ServiceRequestNo,
      title: r.ServiceRequestTitle,
      status: r.servicerequeststatus.ServiceRequestStatusName,
      priority: r.PriorityLevel || "Medium",
      createdAt: r.Created.toLocaleDateString()
    }))
  }
}
