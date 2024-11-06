"use client";

import Accounts from "@/components/Accounts/Accounts";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const AccountsPage = () => {
  return (
    <div>
      <ProtectedRoute>
        <Accounts />
      </ProtectedRoute>
    </div>
  );
};

export default AccountsPage;
