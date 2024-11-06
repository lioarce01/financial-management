"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import AccountsList from "./AccountsList";
import { useFetchUser } from "@/hooks/useFetchUser";
import {
  useGetAccountsQuery,
  useGetTransactionsQuery,
  useGetCategoryCounterQuery,
} from "@/app/redux/api/user";
import TransactionsList from "./TransactionsList";
import MontlyOverview from "./MontlyOverview";
import {
  formatAmount,
  monthlyIncome,
  monthlySpent,
  totalAccountsBalance,
} from "@/lib/utils";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "@/app/redux/slices/transactionSlice";
import { setAccounts } from "@/app/redux/slices/accountSlice";
import Sidebar from "../Sidebar";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#A4DE6C",
];

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(
    (state: RootState) => state.transactionState
  );
  const { accounts } = useSelector((state: RootState) => state.accountState);

  const {
    data: dbUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();
  const userId = dbUser?.id;

  const { data: dbAccounts } = useGetAccountsQuery(
    { userId },
    {
      skip: !userId || !isAuthenticated,
    }
  );

  const { data: dbTransactions } = useGetTransactionsQuery(
    { userId },
    {
      skip: !userId || !isAuthenticated,
    }
  );

  const { data: categoryCounterData } = useGetCategoryCounterQuery(
    { userId },
    {
      skip: !userId || !isAuthenticated,
    }
  );

  useEffect(() => {
    if (dbTransactions) {
      dispatch(setTransaction(dbTransactions.results));
    }
    if (dbAccounts) {
      dispatch(setAccounts(dbAccounts.results));
    }
  }, [dbTransactions, dbAccounts, dispatch]);

  const totalBalance = totalAccountsBalance(accounts);
  const monthlySpentOverview = monthlySpent(transactions);
  const monthlyIncomeOverview = monthlyIncome(transactions);

  const processedCategoryData =
    categoryCounterData?.map((item: any) => ({
      name: item.categoryName === null ? "Uncategorized" : item.categoryName,
      value: item.transactionCount,
    })) || [];

  return (
    <div className="flex min-h-screen bg-gray-100 pl-16 md:pl-20">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Financial Overview</h1>
          <div className="flex space-x-2 md:space-x-4">
            <button className="p-2 rounded hover:bg-gray-100 transition-all duration-300">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <MontlyOverview
            totalBalance={formatAmount(totalBalance)}
            monthlySpent={formatAmount(monthlySpentOverview)}
            monthlyIncome={formatAmount(monthlyIncomeOverview)}
          />
          <div className="bg-gray-50 p-4 md:p-6 shadow rounded-lg mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Transaction Categories
            </h2>
            <div className="h-[280px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {processedCategoryData.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {isAuthenticated && <AccountsList accounts={accounts.slice(0, 3)} />}
          {isAuthenticated && (
            <TransactionsList transactions={transactions.slice(0, 7)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
