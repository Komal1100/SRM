import { signToken } from "@/app/lib/jwt";
import { verifyPassword } from "@/app/lib/password";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();
        if (!identifier || !password) {
            return NextResponse.json(
                { message: "Username/ Email and password is required" },
                { status: 400 }
            );
        }
        console.log({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
        });

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { Username: identifier },
                    { Email: identifier }
                ],
                IsActive: true
            },
            include: {
                userroles: {
                    include: {
                        role: {
                            include: {
                                rolepermission: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {

            return NextResponse.json({ error: "Invalid email or username" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.PasswordHash);

        if (!isValid) {
            console.log("Success  ")

            return NextResponse.json({ error: "Invalid credentials(password)" }, { status: 401 });
        }

        const roles = user.userroles.map(ur => ur.role.RoleCode);

        const permissions = user.userroles.flatMap(ur =>
            ur.role.rolepermission.map(rp => rp.permission.PermissionCode)
        );

        const token = signToken({
            userId: user.UserID,
            username: user.Username,
            roles,
            permissions,
        });

        const res = NextResponse.json({ success: true });

        res.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
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