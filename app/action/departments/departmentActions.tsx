"use server"
import { Prisma } from "@/app/generated/prisma/client";
import { getAuthUser } from "@/app/lib/authUser";
import { hasRole } from "@/app/lib/permission";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Required Fields: ServiceDeptName, CampusID, UserID, Created, and Modified 
// Optional Fields: ManagerStaffID, Description, CCEmailToCSV, and IsRequestTitleDisable 
export async function createDepartment(data: Prisma.servicedeptCreateInput) {
  const user = await getAuthUser();
  if (!user) {
    console.log("Please login first")
    redirect("/dashboard");
  }

  if (!hasRole(user, "ADMIN")) {
    throw new Error("You are not authorize to create department")
  }
  await prisma.servicedept.create({
    data: {
      ...data,
      user: {
        connect: {
          UserID: user.userId
        }
      }
    }
  });
}



interface UpdateDepartmentInput {
  ServiceDeptID: number;
  ServiceDeptName?: string;
  ManagerStaffID?: number | null;
  Description?: string | null;
  CampusID?: number;
  IsRequestTitleDisable?: boolean | null;
  CCEmailToCSV?: string | null;
  IsActive?: boolean;

}

export async function updateDepartment(data: UpdateDepartmentInput) {
  const user = await getAuthUser();
  if (!user) {
    console.log("Please login first")
    redirect("/dashboard");
  }

  if (!hasRole(user, "ADMIN")) {
    throw new Error("You are not authorize to create department")
  }
  console.log(data.ManagerStaffID + "dataaaa")

  const up = await prisma.servicedept.update({
    where: {
      ServiceDeptID: data.ServiceDeptID,
    },
    data: {
      ServiceDeptName: data.ServiceDeptName,
      ManagerStaffID: data.ManagerStaffID,
      Description: data.Description,
      CampusID: data.CampusID,
      IsRequestTitleDisable: data.IsRequestTitleDisable,
      CCEmailToCSV: data.CCEmailToCSV,
      IsActive: data.IsActive,
      Modified: new Date(),
      UserID: user.userId
    },
  });

  console.log(up.ManagerStaffID + "responseeee")
  revalidatePath("/dashboard/admin/departments");
  redirect("/dashboard/admin/departments");
}

export async function toggleDepartmentStatus({ id, isActive }: any) {
  const user = await getAuthUser();
  if (!user) {
    console.log("Please login first")
    redirect("/dashboard");
  }

  if (!hasRole(user, "ADMIN") && !(hasRole(user, "MANAGER"))) {
    throw new Error("You are not authorize to create department")
  }
  await prisma.servicedept.update({
    where: { ServiceDeptID: id },
    data: {
      IsActive: !isActive,
      Modified: new Date(),
      UserID: user.userId
    }
  });
}


export async function getDepartmentById(id: number) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasRole(user, "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const department = await prisma.servicedept.findUnique({
    where: {
      ServiceDeptID: id,
    },
    include: {
      staff: {
        include: {
          user: {
            select: {
              UserID: true,
              Username: true,
              Email: true,
            },
          },
        },
      },
    },
  });

  if (!department) {
    redirect("/dashboard/admin/departments");
  }

  return department;
}

export async function getManagers() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login")
  }

  if (!hasRole(user, "ADMIN")) {
    throw new Error("You are not authorized")
  }

  const managers = await prisma.staff.findMany({
    where: {
      user: {
        userroles: {
          some: {
            role: {
              RoleName: "MANAGER", 
            },
          },
        },
      },
    },
    select: {
      StaffID: true,
      user: {
        select: {
          Username: true,
        },
      },
    },
  });

  return managers;
}
