// import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "./app/lib/jwt";
// import { ROUTE_RULES } from "./app/lib/constants";
// import { getAuthUser } from "./app/lib/authUser";
// import { redirectAfterLogin } from "./app/api/auth/login/action";

import { NextRequest } from "next/server";

// export async function proxy(req: NextRequest) {
//     const pathname = req.nextUrl.pathname;
//     const token = req.cookies.get("auth-token")?.value

//     if (pathname === "/login") {
//         const user = await getAuthUser();

//         if (user) {
//             return redirectAfterLogin();
//         }

//         return NextResponse.next();
//     }
//     if (
//         pathname.startsWith("/signup") ||
//         pathname.startsWith("/api/auth")
//     ) {
//         return NextResponse.next();
//     }

//     if (!token) {
//         return NextResponse.redirect(new URL("/login", req.url));
//     }

//     let user: any;
//     try {
//         user = verifyToken(token);
//     } catch {
//         return NextResponse.redirect(new URL("/login", req.url));
//     }

//     for (const rule of ROUTE_RULES) {
//         if (pathname.startsWith(rule.path)) {
//             if (!user.permissions?.includes(rule.permission)) {
//                 return NextResponse.redirect(
//                     new URL("/dashboard", req.url)
//                 );
//             }
//         }
//     }
//     return NextResponse.next();

// }

// export const config = {
//     matcher: [
//         "/admin/:path*",
//         "/technician/:path*",
//         "/dashboard/:path*",
//         "/login",
//         "/signup",
//     ],
// };
export async function proxy(req: NextRequest) {
    
}