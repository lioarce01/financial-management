"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAccountsQuery } from "@/app/redux/api/user";
import { useFetchUser } from "@/hooks/useFetchUser";
import { formatAmount } from "@/lib/utils";
import AccountDetail from "./AccountDetail";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import {
  setCurrentPage,
  setItemsPerPage,
  setAccounts,
} from "@/app/redux/slices/accountSlice";
import Pagination from "../Pagination";
import Searcher from "../Searcher";

interface Account {
  id: string;
  plaidAccountId: string;
  userId: string;
  mask: string;
  name: string;
  officialName: string;
  subtype: string;
  type: string;
  balance: number;
  currency: string;
}

export default function Accounts() {
  const { accounts, totalCount, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.accountState
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

  const { data, isLoading } = useGetAccountsQuery(
    {
      userId,
    },
    {
      skip: !userId || !isAuthenticated,
    }
  );

  const dispatch = useDispatch();

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  useEffect(() => {
    if (data) {
      dispatch(setAccounts(data.results));
      dispatch({ type: "accounts/setTotalCount", payload: data.count });
    }
  }, [data, dispatch]);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFilteredCount = filteredAccounts.length;

  return (
    <div className="flex-1 overflow-hidden pl-16 md:-pl20">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Accounts</h1>

        <Card className="mb-8">
          <CardHeader className="bg-gray-100 rounded-t-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-neutral-800">
                Account Connected
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
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Mask</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAccounts.length ? (
                      paginatedAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          onClick={() => handleAccountClick(account)}
                          className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        >
                          <TableCell className="font-medium">
                            {account.name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {account.type} - {account.subtype}
                          </TableCell>
                          <TableCell>****{account.mask}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">
                              {formatAmount(account.balance)} {account.currency}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          {isLoading
                            ? "Loading accounts..."
                            : "No accounts found."}
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
      {selectedAccount && (
        <AccountDetail account={selectedAccount} onClose={handleCloseModal} />
      )}
    </div>
  );
}
