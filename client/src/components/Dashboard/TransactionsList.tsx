"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";

const TransactionsList = ({ transactions }: any) => {
  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-150 rounded-t-lg p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-neutral-800">
            Transaction History
          </CardTitle>
          <Link href="/transactions" className="text-gray-500 hover:underline">
            See all transactions
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50 rounded-b-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="hidden md:table-cell py-3 px-4 border-b font-medium text-left">
                  Date
                </th>
                <th className="py-3 px-4 border-b font-medium text-left">
                  Description
                </th>
                <th className="py-3 px-4 border-b font-medium text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions?.map((transaction: any) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="hidden md:table-cell py-3 px-4 border-b text-gray-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-4 border-b text-gray-600">
                      {transaction.name}
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
                ))
              ) : (
                <TableRow className="p-4 border rounded-lg shadow-md bg-white text-gray-500">
                  <TableCell>No transactions found</TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
