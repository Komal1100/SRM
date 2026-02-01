import { assignRequest } from "@/app/action/admin/assignRequest";
import { getEligibleTechnicians } from "@/app/action/admin/getTechnician";
import { redirect } from "next/navigation";

export default async function AssignPage({ params }: any) {
    const {requestId} = await params;
    
    async function action(formData: FormData) {
        "use server";

        await assignRequest(
            Number(requestId),
            Number(formData.get("staffId")),
            String(formData.get("description"))
        );

        redirect("/dashboard/admin/requests")
    }

    const technicians = await getEligibleTechnicians(
        Number(requestId)
    );

    return (
        <form action={action}>
            <h2>Assign Request</h2>

            <select name="staffId" required>
                <option value="">Select technician</option>
                {technicians.map((t: any) => (
                    <option key={t.StaffID} value={t.StaffID}>
                        {t.StaffCode} – {t.Designation}
                    </option>
                ))}
            </select>

            <textarea name="description" placeholder="Assignment note" />

            <button type="submit">Assign</button>
        </form>
    );
}
