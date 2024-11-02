"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="bg-gray-50 w-full">{children}</main>
    </div>
  );
}
