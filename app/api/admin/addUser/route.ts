import { getAuthUser } from "@/app/lib/authUser";
import { hashPassword } from "@/app/lib/password";
import { hasPermission } from "@/app/lib/permission";
import { prisma } from "@/app/lib/prisma";
import { adminCreateUserSchema } from "@/app/schemas/adminCreateUser";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {

        const authUser = await getAuthUser();

        if (!authUser || !(await hasPermission(authUser, "USER_MANAGE"))) {
            return NextResponse.json(
                { error: "FORBIDDEN" },
                { status: 403 }
            );
        }

        const data = await req.json();
        const parsed = adminCreateUserSchema.safeParse(data)

        if (!parsed.success) {
            console.log("Error in parsing" + parsed.error)
            return NextResponse.json(
                { error: parsed.error + " " + parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const {
            username,
            email,
            password,
            roleCode,
            mobileNo,
            staffInfo,
        } = parsed.data;

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();

    



        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ Username: normalizedUsername }, { Email: normalizedEmail }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }


        const role = await prisma.role.findUnique({
            where: { RoleCode: roleCode },
        });

        if (!role) {
            return NextResponse.json(
                { error: "Role not found" },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    Username: username,
                    Email: email,
                    PasswordHash: await hashPassword(password),
                    Created: new Date(),
                    Modified: new Date(),
                    MobileNo: mobileNo,
                    userroles: {
                        create: {
                            RoleID: role.RoleID,
                        },
                    },
                }
            });

            if (roleCode === "TECHNICIAN" || roleCode === "MANAGER" || roleCode==="EMPLOYEE") {
                if (!staffInfo) {
                    throw new Error("STAFF_INFO_REQUIRED");
                }

              

                const staff = await tx.staff.create({
                    data: {
                        UserID: user.UserID,
                        StaffCode: staffInfo.staffCode,
                        Department: staffInfo.department,
                        Designation: staffInfo.designation,
                        Created: new Date(),
                        Modified: new Date(),
                    },
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
            }


            return user;
        });

        return NextResponse.json({
            success: true,
            userId: result.UserID,
        })

    } catch (err: any) {
        if (err.message === "FORBIDDEN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (err.message === "STAFF_INFO_REQUIRED") {
            return NextResponse.json(
                { error: "Staff info required for technician" },
                { status: 400 }
            );
        }

        if (err.code === "P2002") {
            return NextResponse.json(
                { error: "Unique constraint violation" },
                { status: 409 }
            );
        }

        console.error("ADD USER ERROR : ", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );

    }
}

