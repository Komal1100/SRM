
"use server"


import { getAuthUser } from "@/app/lib/authUser"
import { redirect } from "next/navigation";


export const redirectAfterLogin = async () => {
    const user = await getAuthUser();

    if (!user) {
        return;
    }
    console.log(user.permissions)
    redirect("/dashboard")
}
