"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUsers } from "@/app/action/users/getUsers";

interface UserTableProps {
    currentRole: "ADMIN" | "MANAGER";
    departments: string[];
}

const ADMIN_ROLES = [
    "ADMIN",
    "MANAGER",
    "TECHNICIAN",
    "EMPLOYEE",
    "CUSTOMER",
];

const MANAGER_ROLES = [
    "TECHNICIAN",
    "EMPLOYEE",
];

export default function UserTable({
    currentRole,
    departments,
}: UserTableProps) {
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [deptFilter, setDeptFilter] = useState<string>("ALL");
    const [users, setUsers] = useState<any>([]);
    const allowedRoles =
        currentRole === "ADMIN" ? ADMIN_ROLES : MANAGER_ROLES;

    useEffect(() => {
        const fetchUsers = async () => {
            const roleParam = roleFilter === "ALL" ? null : roleFilter;
            const deptParam = deptFilter === "ALL" ? null : deptFilter;
            try {
                const data = await getUsers({
                    role: roleParam,
                    department: deptParam,
                });
                setUsers(data as any);
            } catch (err) {
                throw new Error("Failed to fetch users. Please try again.");
                console.error(err);
            }
        }
        fetchUsers()
    }, [roleFilter, deptFilter]);

    return (
        <div className="space-y-4">

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-wrap gap-4 items-center">
                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        {allowedRoles.map((r) => (
                            <SelectItem key={r} value={r}>
                                {r}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Department Filter */}
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Departments</SelectItem>
                        {departments.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="ml-auto">
                    <Link href="/dashboard/admin/users/add">
                        <Button>Add User</Button>
                    </Link>
                </div>
            </div>

            {/* 🧾 USER TABLE */}
            {users.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    No users found
                </div>
            ) : (
                <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Department</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Mobile No</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user:any) => {
                                const role = user.userroles?.[0]?.role?.RoleCode;

                                return (
                                    <tr
                                        key={user.UserID}
                                        className="border-t hover:bg-muted/50"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {user.Username}
                                        </td>

                                        <td className="px-4 py-3">
                                            {user.Email}
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge variant="outline">{role}</Badge>
                                        </td>

                                        <td className="px-4 py-3">
                                            {user.staff?.[0]?.Department ?? "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {user.IsActive ? (
                                                <Badge className="bg-green-600">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactive</Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                          { user.MobileNo?? "-"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/dashboard/admin/users/${user.UserID}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
