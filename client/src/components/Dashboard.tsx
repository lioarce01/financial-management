"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WalletCards,
  ArrowUpDown,
  PieChart,
  TrendingUp,
  Bell,
  Settings,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AccountsList from "./AccountsList";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/app/redux/slices/userSlice";
import { RootState } from "@/app/redux/store/store";
import AuthButtons from "./AuthButtons";
import PlaidLink from "./PlaidLink";

const DashboardPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(
        setUser({
          id: user.sub || "",
          email: user.email || "",
          name: user.name || "",
        })
      );
    } else {
      dispatch(clearUser());
    }
  }, [isAuthenticated, user, dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const mockData = {
    accountBalance: 24650.8,
    monthlyIncome: 8500,
    monthlyExpenses: 3200,
    spendingChart: [
      { name: "Jan", amount: 2800 },
      { name: "Feb", amount: 3200 },
      { name: "Mar", amount: 2900 },
      { name: "Apr", amount: 3500 },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-6">Finance Hub</h2>
          <nav className="space-y-2">
            <button className="flex items-center space-x-2 text-sm w-full p-2 rounded-lg bg-blue-50 text-blue-700">
              <WalletCards className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button className="flex items-center space-x-2 text-sm w-full p-2 rounded-lg hover:bg-gray-100">
              <ArrowUpDown className="h-4 w-4" />
              <span>Transactions</span>
            </button>
            <button className="flex items-center space-x-2 text-sm w-full p-2 rounded-lg hover:bg-gray-100">
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </button>
            <AuthButtons />
            <PlaidLink />
          </nav>
        </div>
      </div>

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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockData.accountBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Income
              </CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockData.monthlyIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Expenses
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${mockData.monthlyExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                -3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accounts and Spending Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isAuthenticated && <AccountsList />}

          <Card>
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.spendingChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
