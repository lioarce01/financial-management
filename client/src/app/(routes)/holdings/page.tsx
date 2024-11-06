"use client";

import Holdings from "@/components/Holdings/Holdings";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const HoldingsPage = () => {
  return (
    <div>
      <ProtectedRoute>
        <Holdings />
      </ProtectedRoute>
    </div>
  );
};

export default HoldingsPage;
