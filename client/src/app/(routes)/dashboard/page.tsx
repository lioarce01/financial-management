"use client";

import Dashboard from "@/components/Dashboard/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
};

export default DashboardPage;
