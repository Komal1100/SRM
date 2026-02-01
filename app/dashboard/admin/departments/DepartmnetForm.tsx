"use client";

import { createDepartment, updateDepartment } from "@/app/action/departments/departmentActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DepartmentFormProps {
  department?: any;
  managers: any[];
}

export default function DepartmentForm({
  department,
  managers,
}: DepartmentFormProps) {
  const isEdit = Boolean(department);
  
  async function handleSubmit(formData: FormData) {
    // 1. Extract and format common data
    const managerId = formData.get("manager");

    const payload: any = {
      ServiceDeptName: formData.get("name") as string,
      CampusID: Number(formData.get("campusId")),
      Description: formData.get("description") as string,
      CCEmailToCSV: formData.get("ccEmails") as string,
      IsRequestTitleDisable: formData.get("disableTitle") === "on",
      ManagerStaffID: managerId ? Number(managerId) : null,

    };
    if (isEdit) {
      await updateDepartment({
        ...payload,
        ServiceDeptID: department.ServiceDeptID,
        IsActive: department.IsActive,
        Modified: new Date(),
      });
    } else {
      await createDepartment({
        ...payload,
        IsActive: true,
        Created: new Date(),
        Modified: new Date(),
      });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-xl">
      <Input
        name="name"
        placeholder="Department Name"
        defaultValue={department?.ServiceDeptName ?? ""}
        required
      />

      <Input
        name="campusId"
        placeholder="Campus ID"
        type="number"
        defaultValue={department?.CampusID ?? ""}
        required
      />


      <select
        name="manager"
        defaultValue={department?.ManagerStaffID ?? ""}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select Manager</option>

        {managers.map((m) => (
          <option key={m.StaffID} value={m.StaffID}>
            {m.user.Username}
          </option>
        ))}
      </select>

      <Input
        name="description"
        placeholder="Description"
        defaultValue={department?.Description ?? ""}
      />

      <Input
        name="ccEmails"
        placeholder="CC Emails"
        defaultValue={department?.CCEmailToCSV ?? ""}
      />

      <label className="flex gap-2 items-center text-sm">
        <input
          type="checkbox"
          name="disableTitle"
          defaultChecked={department?.IsRequestTitleDisable ?? false}
        />
        Disable Request Title
      </label>

      <Button>
        {isEdit ? "Update Department" : "Create Department"}
      </Button>
    </form>
  );
}
