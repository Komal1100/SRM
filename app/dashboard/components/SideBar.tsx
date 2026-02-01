import Link from "next/link";
import { SIDEBAR_MENU } from "../config/sidebarMenu";
import { canAccessMenu } from "@/app/lib/sidebarAccess";

export default function Sidebar({ user }: { user: any }) {
  return (
    <aside className="w-64 bg-white border-r">
      <nav className="p-4 space-y-2">
        {SIDEBAR_MENU.filter((item) =>
          canAccessMenu(user, item)
        ).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
