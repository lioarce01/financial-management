"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="bg-gray-100 flex-1 transition-all duration-300 ease-in-out pl-16 md:pl-20">
        {children}
      </main>
    </div>
  );
}
