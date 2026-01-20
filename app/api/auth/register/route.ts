import { signToken } from "@/app/lib/jwt";
import { hashPassword } from "@/app/lib/password";
import { prisma } from "@/app/lib/prisma";
import { createUserSchema } from "@/app/schemas/signupSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const parsed = createUserSchema.safeParse(data)

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        const { username, email, password, roleCode, mobileNo, staffInfo } = parsed.data;

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();


        if (!["EMPLOYEE", "CUSTOMER"].includes(roleCode)) {
            return NextResponse.json(
                { error: "Invalid signup role" },
                { status: 403 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ Username: username }, { Email: email }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
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

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                Username: normalizedUsername,
                Email: normalizedEmail,
                PasswordHash: passwordHash,
                Created: new Date(),
                Modified: new Date(),
                MobileNo: mobileNo,
                userroles: {
                    create: {
                        RoleID: role.RoleID,
                    },
                },
            },
            include: {
                userroles: {
                    include: {
                        role: {
                            include: {
                                rolepermission: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const roles = user.userroles.map(ur => ur.role.RoleCode);

        const permissions = user.userroles.flatMap(ur =>
            ur.role.rolepermission.map(rp => rp.permission.PermissionCode)
        );

        if (roleCode === "EMPLOYEE") {
            if (!staffInfo) {
                throw new Error("STAFF_INFO_REQUIRED");
            }

            await prisma.$transaction(async (tx) => {
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
                        IsHODStaff: false,
                        UserID: user.UserID,
                        Created: new Date(),
                        Modified: new Date(),
                    },
                });
            });

        }

        const token = signToken({
            userId: user.UserID,
            username: user.Username,
            roles,
            permissions,
        });

        const res = NextResponse.json({ success: true })
        res.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });

        return res;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}