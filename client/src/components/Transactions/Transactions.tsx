"use client";

import React, { useEffect, useState } from "react";
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
import { useGetTransactionsQuery } from "@/app/redux/api/user";
import { useFetchUser } from "@/hooks/useFetchUser";
import { formatAmount, formatDate } from "@/lib/utils";
import TransactionDetail from "./TransactionDetail";
import { RootState } from "@/app/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../Pagination";
import {
  setCurrentPage,
  setItemsPerPage,
  setTransaction,
  transactionSlice,
} from "@/app/redux/slices/transactionSlice";
import { setSearchTerm } from "@/app/redux/slices/filterSlice";
import Searcher from "../Searcher";

interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  transaction_id: string;
  amount: number;
  iso_currency_code: string;
  date: string;
  merchant_name: string;
  pending: boolean;
  payment_channel: string;
  transaction_type: string;
  logo_url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  category: { primary: string };
}

export default function Transactions() {
  const { transactions, totalCount, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.transactionState
  );
  const searchTerm = useSelector(
    (state: RootState) => state.filterState.searchTerm
  );

  const {
    data: dbUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();

  const userId = dbUser?.id;

  const { data, isLoading } = useGetTransactionsQuery(
    {
      userId,
    },
    {
      skip: !userId || !isAuthenticated,
    }
  );
  const dispatch = useDispatch();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  useEffect(() => {
    if (data) {
      dispatch(setTransaction(data.results));
      dispatch({ type: "transactions/setTotalCount", payload: data.count });
    }
  }, [data, dispatch, currentPage]);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFilteredCount = filteredTransactions.length;

  return (
    <div className="flex-1 overflow-hidden pl-16 md:pl-20">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

        <Card className="mb-8">
          <CardHeader className="bg-gray-100 rounded-t-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-neutral-800">
                Transaction History
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Searcher />
                </div>
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
                        Status
                      </TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions && !isLoading ? (
                      paginatedTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          onClick={() => handleTransactionClick(transaction)}
                          className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        >
                          <TableCell className="font-medium">
                            {formatDate(transaction.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {Math.abs(transaction.amount) ===
                              transaction.amount ? (
                                <ArrowUpIcon className="text-green-500" />
                              ) : (
                                <ArrowDownIcon className="text-red-500" />
                              )}
                              <span>{transaction.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {transaction.pending ? "Pending" : "Completed"}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`font-medium ${
                                transaction.amount < 0
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {formatAmount(Math.abs(transaction.amount))}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          {isLoading
                            ? "Loading transactions..."
                            : "No transactions found."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalFilteredCount / itemsPerPage)}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(value) => dispatch(setItemsPerPage(value))}
            />
          </CardContent>
        </Card>
      </div>
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
