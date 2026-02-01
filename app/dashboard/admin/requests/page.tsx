import { getRequestsForUser } from "@/app/action/requests/requests.service";
import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import { redirect } from "next/navigation";
import RequestTable from "./RequestTable";
import { columns } from "./columns";

export default async function RequestListPage() {
  const user = await getAuthUser();

  if (!hasPermission(user, "SR_VIEW_ALL")) {
    redirect("/dashboard");
  }

  const requests = await getRequestsForUser(user);
  console.log(requests)
  return (
    <div>
      <h1 className="text-xl font-semibold">Service Requests</h1>
      <RequestTable data={requests} columns={columns} />
    </div>
  );
}
