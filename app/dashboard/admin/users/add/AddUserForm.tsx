"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from 'react-select';

type Department = {
    ServiceDeptID: number;
    ServiceDeptName: string;
};

type AddUserFormProps = {
    departments: Department[];
};

type Option = {
    value: number;
    label: string;
};



export default function AddUserPage({ departments }: AddUserFormProps) {
    const [role, setRole] = useState("");
    const [dept, setDept] = useState<Option | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const deptOptions: Option[] = departments.map(dept => ({
        value: dept.ServiceDeptID,
        label: dept.ServiceDeptName
    }))
    const isStaffRole = role === "TECHNICIAN" || role === "EMPLOYEE";


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log("Hello");
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
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
                    department: formData.get("department"),           
                    serviceDeptID: Number(formData.get("serviceDeptID")), 
                };
            } 
            const res = await fetch('/api/admin/addUser', {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),

            });

            if (!res.ok) {
                const errorData = await res.json(); 

                console.log(errorData.message); 

                throw new Error(errorData.message || 'Failed to create user'); 
            }

            console.log("User Successfully created");

            router.push("/dashboard");
        } catch (e: any) {
            console.log("EROR : ", e)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-6">Add New User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full border p-2 rounded"
                    placeholder="Username"
                    name="username"
                    required
                />

                <input
                    type="email"
                    className="w-full border p-2 rounded"
                    placeholder="Email"
                    name="email"
                    required
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Mobile No"
                    name="mobile"
                />

                <input
                    type="password"
                    className="w-full border p-2 rounded"
                    placeholder="Temporary Password"
                    name="password"
                    required
                />

                {/* ROLE */}
                <select
                    className="w-full border p-2 rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    name="role"
                    required
                >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="CUSTOMER">Customer</option>
                </select>

                {/* STAFF FIELDS */}
                {isStaffRole && (
                    <div className="border rounded p-4 space-y-3 bg-gray-50">
                        <p className="text-sm font-medium text-gray-600">
                            Staff Details
                        </p>

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Staff Code"
                            name="staffCode"
                            required
                        />

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Designation"
                            name="designation"
                            required
                        />

                        <Select
                            options={deptOptions}
                            value={dept}
                            onChange={setDept}
                            placeholder="Select Department..."
                        />
                        <input
                            type="hidden"
                            name="department"
                            value={dept?.label ?? ""}
                        />

                        <input
                            type="hidden"
                            name="serviceDeptID"
                            value={dept?.value ?? ""}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Create User
                </button>
            </form>
        </div>
    );
}
