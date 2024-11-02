"use client";

import React from "react";
import { Bell, Settings } from "lucide-react";

import AccountsList from "./AccountsList";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useGetAccountsQuery } from "@/app/redux/api/user";
import TransactionsList from "./TransactionsList";
import MontlyOverview from "./MontlyOverview";

const DashboardPage = () => {
  const {
    data: dbUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();

  const { data: accounts, refetch: refetchAccounts } = useGetAccountsQuery(
    dbUser?.id ?? "",
    {
      skip: !dbUser?.id || !isAuthenticated,
    }
  );

  const totalBalance = accounts?.reduce(
    (acc, account) => acc + account.balance,
    0
  );

  const mockTransactions = [
    { id: 1, date: "2024-10-15", description: "Grocery Store", amount: -50.25 },
    { id: 2, date: "2024-10-16", description: "Salary", amount: 3000.0 },
    { id: 3, date: "2024-10-18", description: "Utility Bill", amount: -120.5 },
    {
      id: 4,
      date: "2024-10-20",
      description: "Online Subscription",
      amount: -15.0,
    },
    { id: 5, date: "2024-10-25", description: "Restaurant", amount: -80.0 },
    { id: 6, date: "2024-10-25", description: "Restaurant", amount: -80.0 },
    { id: 7, date: "2024-10-25", description: "Restaurant", amount: -80.0 },
  ];

  const monthlySpent = Math.abs(
    mockTransactions.reduce(
      (acc, transaction) =>
        acc + (transaction.amount < 0 ? transaction.amount : 0),
      0
    )
  );

  const monthlyIncome = Math.abs(
    mockTransactions.reduce(
      (acc, transaction) =>
        acc + (transaction.amount > 0 ? transaction.amount : 0),
      0
    )
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <div className="flex space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Monthly Overview */}
        <MontlyOverview
          totalBalance={totalBalance}
          monthlySpent={monthlySpent}
          monthlyIncome={monthlyIncome}
        />

        {/* Accounts and Spending Overview */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts List */}
          {isAuthenticated && <AccountsList accounts={accounts} />}

          {/* Transaction History */}
          {isAuthenticated && (
            <TransactionsList transactions={mockTransactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
