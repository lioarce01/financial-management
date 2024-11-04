// DashboardPage.tsx
"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import AccountsList from "./AccountsList";
import { useFetchUser } from "@/hooks/useFetchUser";
import {
  useGetAccountsQuery,
  useGetTransactionsQuery,
} from "@/app/redux/api/user";
import TransactionsList from "./TransactionsList";
import MontlyOverview from "./MontlyOverview";
import { formatAmount } from "@/lib/utils";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setTransaction } from "@/app/redux/slices/transactionSlice";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(
    (state: RootState) => state.transactionState
  );
  const {
    data: dbUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();
  const userId = dbUser?.id;

  const { data: accounts } = useGetAccountsQuery(userId ?? "", {
    skip: !userId || !isAuthenticated,
  });

  const { data } = useGetTransactionsQuery(
    {
      offset: 0,
      limit: 5,
      userId,
    },
    {
      skip: !userId || !isAuthenticated,
    }
  );

  useEffect(() => {
    if (data) {
      dispatch(setTransaction(data.results));
    }
  }, [data, dispatch]);

  const totalBalance = accounts?.reduce(
    (acc, account) => acc + account.balance,
    0
  );

  const monthlySpent = Math.abs(
    transactions?.reduce(
      (acc, transaction) =>
        acc + (transaction.amount < 0 ? transaction.amount : 0),
      0
    )
  );

  const monthlyIncome = Math.abs(
    transactions?.reduce(
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
            <button className="p-2 rounded hover:bg-gray-100 transition-all duration-300">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Monthly Overview */}
        <MontlyOverview
          totalBalance={formatAmount(totalBalance)}
          monthlySpent={formatAmount(monthlySpent)}
          monthlyIncome={formatAmount(monthlyIncome)}
        />

        {/* Accounts and Spending Overview */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts List */}
          {isAuthenticated && <AccountsList accounts={accounts} />}

          {/* Transaction History Overview */}
          {isAuthenticated && <TransactionsList transactions={transactions} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
