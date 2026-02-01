import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import { prisma } from "@/app/lib/prisma";
import { adminUpdateUserSchema } from "@/app/schemas/adminUpdateSchema";
import { NextResponse } from "next/server";


type Params = {
  params: { id: string };
};

export async function PUT(req: Request, { params }: Params) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || !(await hasPermission(authUser, "USER_MANAGE"))) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    const resolvedParams = await params;

    const userId = Number(resolvedParams.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const data = await req.json();
    console.log(data)
    const parsed = adminUpdateUserSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, mobileNo, roleCode, staffInfo } = parsed.data;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { UserID: userId },
      include: {
        staff: true,
        userroles: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const role = await prisma.role.findUnique({
      where: { RoleCode: roleCode },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      /* ---------------- USER ---------------- */
      await tx.user.update({
        where: { UserID: userId },
        data: {
          Email: normalizedEmail,
          MobileNo: mobileNo,
          Modified: new Date(),
        },
      });

      /* ---------------- ROLE ---------------- */
      await tx.userrole.deleteMany({
        where: { UserID: userId },
      });

      await tx.userrole.create({
        data: {
          UserID: userId,
          RoleID: role.RoleID,
        },
      });

      /* ---------------- STAFF ---------------- */
      const isStaffRole =
        roleCode === "TECHNICIAN" ||
        roleCode === "MANAGER" ||
        roleCode === "EMPLOYEE";
      if (isStaffRole) {
        if (!staffInfo) {
          throw new Error("STAFF_INFO_REQUIRED");
        }

        let staff = user.staff[0];

        // Create staff if missing
        if (!staff) {
          staff = await tx.staff.create({
            data: {
              UserID: userId,
              StaffCode: staffInfo.staffCode,
              Department: staffInfo.department,
              Designation: staffInfo.designation,
              Created: new Date(),
              Modified: new Date(),
            },
          });
        } else {
          await tx.staff.update({
            where: { StaffID: staff.StaffID },
            data: {
              StaffCode: staffInfo.staffCode,
              Department: staffInfo.department,
              Designation: staffInfo.designation,
              Modified: new Date(),
            },
          });
        }

        // Update service dept mapping
        await tx.servicedeptperson.deleteMany({
          where: { StaffID: staff.StaffID },
        });

        await tx.servicedeptperson.create({
          data: {
            ServiceDeptID: staffInfo.serviceDeptID,
            StaffID: staff.StaffID,
            FromDate: new Date(),
            IsHODStaff: roleCode === "MANAGER",
            UserID: authUser.userId,
            Created: new Date(),
            Modified: new Date(),
          },
        });
      } else {
        // Remove staff if role is no longer staff
        if (user.staff && user.staff.length > 0) {
          await tx.servicedeptperson.deleteMany({
            where: { StaffID: user.staff[0].StaffID },
          });

          await tx.staff.delete({
            where: { StaffID: user.staff[0].StaffID },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === "STAFF_INFO_REQUIRED") {
      return NextResponse.json(
        { error: "Staff info required for staff role" },
        { status: 400 }
      );
    }

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Unique constraint violation" },
        { status: 409 }
      );
    }

    console.error("EDIT USER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
