"use server";

import { Console } from "console";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


export async function addUserAction(formData: FormData) {
    const roleCode = formData.get("role") as string;

    const payload: any = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        roleCode,
        mobileNo: formData.get("mobile"),
    };

    if (roleCode === "TECHNICIAN" || roleCode === "EMPLOYEE") {
        payload.staffInfo = {
            staffCode: formData.get("staffCode"),
            designation: formData.get("designation"),
            department: formData.get("department"),           // ✅ NAME
            serviceDeptID: Number(formData.get("serviceDeptID")), // ✅ ID
        };
    }
        const cookieHeader = cookies();


    const res = await fetch('http://localhost:3000/api/admin/addUser', {
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json","Cookie": (await cookieHeader).toString(), },
        body: JSON.stringify(payload),
        
    });

    if (!res.ok) {
        console.log(res.statusText)
        throw new Error("Failed to create user");
    }

    console.log("User Successfully created");

    revalidatePath("/dashboard/admin");
}
