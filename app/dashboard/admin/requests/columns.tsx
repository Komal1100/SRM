"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<any>[] = [
  {
    header: "Request No",
    accessorKey: "ServiceRequestNo",
  },

  {
    header: "Title",
    accessorKey: "ServiceRequestTitle",
  },

  {
    header: "Department",
    accessorFn: (row) =>
      row.servicerequesttype?.servicedept?.ServiceDeptName ?? "-",
  },

  {
    header: "Type",
    accessorFn: (row) =>
      row.servicerequesttype?.ServiceRequestTypeName ?? "-",
  },

  {
    header: "Priority",
    accessorKey: "PriorityLevel",
  },

  {
    header: "Status",
    accessorFn: (row) =>
      row.servicerequeststatus?.ServiceRequestStatusName ?? "-",
    cell: ({ getValue }) => {
      const status = getValue() as string;

      const color =
        status === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : status === "Assigned"
          ? "bg-blue-100 text-blue-800"
          : status === "In Progress"
          ? "bg-purple-100 text-purple-800"
          : status === "Completed"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800";

      return (
        <span className={`px-2 py-1 rounded text-sm font-medium ${color}`}>
          {status}
        </span>
      );
    },
  },

  {
    header: "Created",
    accessorFn: (row) =>
      new Date(row.Created).toLocaleDateString(),
  },

  {
    header: "Action",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/admin/assign/${row.original.ServiceRequestID}`}
        className="text-blue-600 hover:underline"
      >
        Assign
      </Link>
    ),
  },
];
