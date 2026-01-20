"use client";

import { useRouter } from "next/navigation";

export default function Topbar({ user }: any) {
  const router = useRouter();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-bold text-lg">Service Request System</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user.username}</span>
        <button
          onClick={() => {
            document.cookie = "token=; Max-Age=0";
            router.push("/login");
          }}
          className="text-sm text-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
