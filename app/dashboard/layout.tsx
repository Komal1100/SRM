import { getAuthUser } from "@/app/lib/authUser";
import Sidebar from "./components/SideBar";
import Topbar from "./components/TopBar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) redirect("/login");

  return (
    <div className="h-screen flex flex-col">
      <Topbar user={user} />

      <div className="flex flex-1">
        <Sidebar user={user} />

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
