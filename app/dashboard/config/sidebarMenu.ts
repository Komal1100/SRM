import { IconType } from "react-icons";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiSettings,
} from "react-icons/fi";


export type SidebarItem = {
  label: string;
  href: string;
  icon: IconType;
  roles?: string[];
  permissions?: string[];
};

export const SIDEBAR_MENU: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: FiHome,
  },

  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: FiUsers,
    permissions: ["USER_MANAGE"],
  },

  {
    label: "All Requests",
    href: "/dashboard/admin/requests",
    icon: FiClipboard,
    permissions: ["SR_VIEW_ALL"],
  },

  {
    label: "Assigned Requests",
    href: "/dashboard/technician/requests",
    icon: FiClipboard,
    roles: ["TECHNICIAN"],
  },

  {
    label: "My Requests",
    href: "/dashboard/user/requests",
    icon: FiClipboard,
    // permissions: ["SR_VIEW_OWN"],
    roles: ['CUSTOMER', 'TECHNICIAN', 'EMPLOYEE']

  },

  {
    label: "Departments",
    href: "/dashboard/admin/departments",
    icon: FiClipboard,
    roles: ['ADMIN'],
  },

  {
    label: "Master Data",
    href: "/dashboard/admin/master",
    icon: FiSettings,
    permissions: ["MASTER_MANAGE"],
  },
];
