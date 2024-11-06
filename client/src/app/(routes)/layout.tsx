"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import NotFound from "@/components/404";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {pathname !== "/404" && <Sidebar />}
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
