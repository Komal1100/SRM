"use server"
import { getAuthUser } from "@/app/lib/authUser";
import { hasRole } from "@/app/lib/permission";
import { prisma } from "@/app/lib/prisma";

export async function getUsers(filters: {
    role: string | null;
    department: string | null;
}) {


    const user = await getAuthUser();
    if (!user) return new Error("Please login first")

    const fullUser = await prisma.user.findUnique({
        where: {
            UserID: user.userId,
        },
        include: {
            staff: true
        }
    })
    const IsAdmin = await hasRole(user, "ADMIN");
    const IsManager = await hasRole(user, "MANAGER")
    if (!IsAdmin && !IsManager) {
        throw new Error("Unauthorized")
    }

    const where: any = { IsActive: true }
    if (IsAdmin) {
        if (filters?.role) {
            where.userroles = {
                some: { role: { RoleCode: filters.role } }
            };
        }

        if (filters?.department) {
            where.staff ={ some :{ Department: filters.department }};
        }
    }

    // If Manager
    if (IsManager) {
        where.staff = { Department: fullUser?.staff[0].Department }

        where.userRole = {
            some: {
                role: {
                    RoleCode: { in: ["EMPLOYEE", "TECHNICIAN"] }
                }
            }
        }

        if (filters?.role) {
            where.userRole = {
                some: { role: { RoleCode: filters.role } }
            };
        }
    }

    return prisma.user.findMany({
        where,
        include: {
            staff: true,
            userroles: { include: { role: true } }
        },
        orderBy: { Created: "desc" }
    });
}