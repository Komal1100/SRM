import { getRequestsForUser } from "@/app/action/requests/requests.service";
import { getAuthUser } from "@/app/lib/authUser";
import { hasPermission } from "@/app/lib/permission";
import { redirect } from "next/navigation";
import RequestTable from "../../components/requests/RequestTable";
import { columns } from "../../components/requests/columns";

export default async function RequestListPage() {
  const user = await getAuthUser();

  const requests = await getRequestsForUser(user);
  return (
    <div>
      <h1 className="text-xl font-semibold">Service Requests</h1>
      <RequestTable data={requests} columns={columns} mode='user'/>
    </div>
  );
}
