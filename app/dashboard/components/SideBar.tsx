"use client";

import { hasPermission } from "@/app/lib/permission";
import NavItem from "./NavItem";

export default function SideBard({ user }: any) {
    return (
        <aside className="w-64 bg-white border-r p-4">
            <nav className="space-y-2">
                {hasPermission(user, "SR_VIEW_OWN") && (
                    <NavItem label="My Requests" href="/dashboard" />
                )}

                {hasPermission(user, "SR_CREATE") && (
                    <NavItem label="Create Request" href="/dashboard/requests/new" />
                )}

                {hasPermission(user, "SR_UPDATE_STATUS") && (
                    <NavItem label="Assigned Requests" href="/dashboard/assigned" />
                )}

                {hasPermission(user, "USER_MANAGE") && (
                    <NavItem label="User Management" href="/dashboard/admin/users" />
                )}

                {hasPermission(user, "MASTER_MANAGE") && (
                    <NavItem label="Master Management" href="/dashboard/admin/master" />
                )}

                {hasPermission(user, "REPORT_VIEW") && (
                    <NavItem label="Reports" href="/dashboard/reports" />
                )}

            </nav>
        </aside>
    )
}