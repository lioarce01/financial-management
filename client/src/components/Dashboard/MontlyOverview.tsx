import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowUpDown, DollarSign, TrendingUp, Eye, EyeOff } from "lucide-react";

const MontlyOverview = ({ monthlySpent, monthlyIncome, totalBalance }: any) => {
  const [showTotalBalance, setShowTotalBalance] = useState(true);
  const [showMonthlyIncome, setShowMonthlyIncome] = useState(true);
  const [showMonthlySpent, setShowMonthlySpent] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Total Balance</CardTitle>
          <DollarSign className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex space-x-4">
              <div className="text-2xl font-bold">
                {showTotalBalance
                  ? `${totalBalance?.toLocaleString()}`
                  : "******"}
              </div>
              <button
                onClick={() => setShowTotalBalance(!showTotalBalance)}
                className="text-muted-foreground hover:text-gray-600 transition-colors"
              >
                {showTotalBalance ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Monthly Income</CardTitle>
          <TrendingUp className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex space-x-4">
              <div className="text-2xl font-bold">
                {showMonthlyIncome
                  ? `${monthlyIncome?.toLocaleString()}`
                  : "******"}
              </div>
              <button
                onClick={() => setShowMonthlyIncome(!showMonthlyIncome)}
                className="text-muted-foreground hover:text-gray-600 transition-colors"
              >
                {showMonthlyIncome ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Monthly Spent</CardTitle>
          <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex space-x-4">
              <div className="text-2xl font-bold">
                {showMonthlySpent ? `${monthlySpent}` : "******"}
              </div>
              <button
                onClick={() => setShowMonthlySpent(!showMonthlySpent)}
                className="text-muted-foreground hover:text-gray-600 transition-colors"
              >
                {showMonthlySpent ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MontlyOverview;
