"use client";

import React from "react";
import Transactions from "@/components/Transactions/Transactions";
import ProtectedRoute from "@/components/ProtectedRoute";

const TransactionsPage = () => {
  return (
    <div>
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    </div>
  );
};

export default TransactionsPage;
