"use client";

import React, { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2023-06-01",
    description: "Salary",
    category: "Income",
    amount: 5000,
    type: "income",
  },
  {
    id: "2",
    date: "2023-06-02",
    description: "Rent",
    category: "Housing",
    amount: -1500,
    type: "expense",
  },
  {
    id: "3",
    date: "2023-06-03",
    description: "Groceries",
    category: "Food",
    amount: -200,
    type: "expense",
  },
  {
    id: "4",
    date: "2023-06-04",
    description: "Freelance Work",
    category: "Income",
    amount: 1000,
    type: "income",
  },
  {
    id: "5",
    date: "2023-06-05",
    description: "Utilities",
    category: "Bills",
    amount: -150,
    type: "expense",
  },
  {
    id: "6",
    date: "2023-06-05",
    description: "Utilities",
    category: "Bills",
    amount: -150,
    type: "expense",
  },
  {
    id: "7",
    date: "2023-06-05",
    description: "Utilities",
    category: "Bills",
    amount: -150,
    type: "expense",
  },
  {
    id: "8",
    date: "2023-06-05",
    description: "Utilities",
    category: "Bills",
    amount: -150,
    type: "expense",
  },
];

export default function Transactions() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const transactionsPerPage = 10;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    const matchesFilter = filter === "all" || transaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

        <Card className="mb-8">
          <CardHeader className="bg-blue-50 rounded-t-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-blue-800">
                Transaction History
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 bg-white w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter transactions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 bg-white rounded-b-lg">
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <TableCell className="font-medium">
                          {transaction.date}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {transaction.type === "income" ? (
                              <ArrowUpIcon className="text-green-500" />
                            ) : (
                              <ArrowDownIcon className="text-red-500" />
                            )}
                            <span>{transaction.description}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {transaction.category}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium ${
                              transaction.amount < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="border-t space-x-2 flex items-center">
              <span className="text-gray-700">Total:</span>{" "}
              <span className="text-gray-700">
                {transactions.length} transactions
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
