"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

const TransactionsList = ({ transactions }: any) => {
  return (
    <Card className="">
      <CardHeader className="bg-blue-50 rounded-t-lg p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-blue-800">
            Transaction History
          </CardTitle>
          <Link href="/transactions" className="text-gray-500 hover:underline">
            See all transactions
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50 rounded-b-lg">
        <div className="overflow-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="py-3 px-4 border-b font-medium">Date</th>
                <th className="py-3 px-4 border-b font-medium">Description</th>
                <th className="py-3 px-4 border-b font-medium text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 border-b text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-600">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 border-b text-right">
                    {transaction.amount < 0 ? (
                      <span className="text-red-500 font-medium">
                        -${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-500 font-medium">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
