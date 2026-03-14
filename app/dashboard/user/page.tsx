import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const user = await getAuthUser();

  // Safety check
  if (!user) {
    redirect("/login");
  }

  

  return (
    <>
    <h1>Helllo  Users</h1>
    <Link href='/dashboard/user/requests/new'>+ New Request</Link>
    </>
    
  );
}