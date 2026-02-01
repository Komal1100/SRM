// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Select from 'react-select';

// type Department = {
//     ServiceDeptID: number;
//     ServiceDeptName: string;
// };

// type AddUserFormProps = {
//     departments: Department[];
// };

// type Option = {
//     value: number;
//     label: string;
// };



// export default function AddUserPage({ departments }: AddUserFormProps) {
//     const [role, setRole] = useState("");
//     const [dept, setDept] = useState<Option | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const router = useRouter();

//     const deptOptions: Option[] = departments.map(dept => ({
//         value: dept.ServiceDeptID,
//         label: dept.ServiceDeptName
//     }))
//     const isStaffRole = role === "TECHNICIAN" || role === "EMPLOYEE" || role==="MANAGER";


//     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         const formData = new FormData(e.currentTarget);

//         try {
//             const roleCode = formData.get("role") as string;

//             const payload: any = {
//                 username: formData.get("username"),
//                 email: formData.get("email"),
//                 password: formData.get("password"),
//                 roleCode,
//                 mobileNo: formData.get("mobile"),
//             };

//             if (isStaffRole ) {
//                 payload.staffInfo = {
//                     staffCode: formData.get("staffCode"),
//                     designation: formData.get("designation"),
//                     department: formData.get("department"),           
//                     serviceDeptID: Number(formData.get("serviceDeptID")), 
//                 };
//             } 
//             const res = await fetch('/api/admin/addUser', {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json", },
//                 body: JSON.stringify(payload),

//             });

//             if (!res.ok) {
//                 const errorData = await res.json(); 

//                 console.log(errorData.message); 

//                 throw new Error(errorData.message || 'Failed to create user'); 
//             }

//             console.log("User Successfully created");

//             router.push("/dashboard");
//         } catch (e: any) {
//             console.log("EROR : ", e)
//         }
//     }

//     return (
//         <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
//             <h2 className="text-xl font-semibold mb-6">Add New User</h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     className="w-full border p-2 rounded"
//                     placeholder="Username"
//                     name="username"
//                     required
//                 />

//                 <input
//                     type="email"
//                     className="w-full border p-2 rounded"
//                     placeholder="Email"
//                     name="email"
//                     required
//                 />

//                 <input
//                     className="w-full border p-2 rounded"
//                     placeholder="Mobile No"
//                     name="mobile"
//                 />

//                 <input
//                     type="password"
//                     className="w-full border p-2 rounded"
//                     placeholder="Temporary Password"
//                     name="password"
//                     required
//                 />

//                 {/* ROLE */}
//                 <select
//                     className="w-full border p-2 rounded"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     name="role"
//                     required
//                 >
//                     <option value="">Select Role</option>
//                     <option value="ADMIN">Admin</option>
//                     <option value="MANAGER">Manager</option>
//                     <option value="TECHNICIAN">Technician</option>
//                     <option value="EMPLOYEE">Employee</option>
//                     <option value="CUSTOMER">Customer</option>
//                 </select>

//                 {/* STAFF FIELDS */}
//                 {isStaffRole && (
//                     <div className="border rounded p-4 space-y-3 bg-gray-50">
//                         <p className="text-sm font-medium text-gray-600">
//                             Staff Details
//                         </p>

//                         <input
//                             className="w-full border p-2 rounded"
//                             placeholder="Staff Code"
//                             name="staffCode"
//                             required
//                         />

//                         <input
//                             className="w-full border p-2 rounded"
//                             placeholder="Designation"
//                             name="designation"
//                             required
//                         />

//                         <Select
//                             options={deptOptions}
//                             value={dept}
//                             onChange={setDept}
//                             placeholder="Select Department..."
//                         />
//                         <input
//                             type="hidden"
//                             name="department"
//                             value={dept?.label ?? ""}
//                         />

//                         <input
//                             type="hidden"
//                             name="serviceDeptID"
//                             value={dept?.value ?? ""}
//                         />
//                     </div>
//                 )}

//                 <button
//                     type="submit"
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                     Create User
//                 </button>
//             </form>
//         </div>
//     );
// }



"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

type Department = {
  ServiceDeptID: number;
  ServiceDeptName: string;
};

type StaffInfo = {
  staffCode: string;
  designation: string;
  department: string;
  serviceDeptID: number;
};

type User = {
  id: number;
  username: string;
  email: string;
  mobileNo: string | null;
  roleCode: string;
  staffInfo?: StaffInfo;
};

type Option = {
  value: number;
  label: string;
};

type Props = {
  departments: Department[];
  user?: User;
};

export default function AddEditUserForm({ departments, user }: Props) {
  const router = useRouter();
  const isEditMode = Boolean(user);

  const [role, setRole] = useState(user?.roleCode ?? "");
  const [dept, setDept] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isStaffRole =
    role === "TECHNICIAN" || role === "EMPLOYEE" || role === "MANAGER";

  const deptOptions: Option[] = departments.map((d) => ({
    value: d.ServiceDeptID,
    label: d.ServiceDeptName,
  }));

  // Prefill department on edit
  useEffect(() => {
    if (user?.staffInfo) {
      setDept({
        value: user.staffInfo.serviceDeptID,
        label: user.staffInfo.department,
      });
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const payload: any = {
        username: formData.get("username"),
        email: formData.get("email"),
        mobileNo: formData.get("mobile"),
        roleCode: role,
      };

      // Password only for Add
      if (!isEditMode) {
        payload.password = formData.get("password");
      }

      if (isStaffRole) {
        payload.staffInfo = {
          staffCode: formData.get("staffCode"),
          designation: formData.get("designation"),
          department: dept?.label,
          serviceDeptID: dept?.value,
        };
      }

      const url = isEditMode
        ? `/api/admin/editUser/${user!.id}`
        : `/api/admin/addUser`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/users");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit User" : "Add New User"}
      </h2>

      {error && (
        <div className="mb-4 rounded bg-red-100 text-red-700 p-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <input
          name="username"
          defaultValue={user?.username}
          disabled={isEditMode}
          required
          className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          placeholder="Username"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          defaultValue={user?.email}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
        />

        {/* Mobile */}
        <input
          name="mobile"
          defaultValue={user?.mobileNo ?? ""}
         className="w-full border rounded px-3 py-2"
          placeholder="Mobile No"
        />

        {/* Password (Add only) */}
        {!isEditMode && (
          <input
            type="password"
            name="password"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Temporary Password"
          />
        )}

        {/* Role */}
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="TECHNICIAN">Technician</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="CUSTOMER">Customer</option>
        </select>

        {/* Staff Section */}
        {isStaffRole && (
          <div className="rounded-lg border bg-gray-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-600">
              Staff Information
            </p>

            <input
              name="staffCode"
              defaultValue={user?.staffInfo?.staffCode}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Staff Code"
            />

            <input
              name="designation"
              defaultValue={user?.staffInfo?.designation}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Designation"
            />

            <Select
              options={deptOptions}
              value={dept}
              onChange={setDept}
              placeholder="Select Department"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update User"
              : "Create User"}
        </button>
      </form>
    </div>
  );
}
