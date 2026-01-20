"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ label, href }: any) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded text-sm ${
        active
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}
