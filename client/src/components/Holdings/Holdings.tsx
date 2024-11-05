"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
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
import { formatAmount, formatDate } from "@/lib/utils";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useGetAllHoldingsQuery } from "@/app/redux/api/user";
import HoldingDetail from "./HoldingsDetail";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import {
  setCurrentPage,
  setHoldings,
  setItemsPerPage,
  setTotalGainsLosses,
} from "@/app/redux/slices/holdingSlice";
import Pagination from "../Pagination";

interface Holding {
  id: string;
  accountId: string;
  cost_basis: number;
  institution_price: number;
  institution_price_as_of: string;
  institution_value: number;
  quantity: number;
  iso_currency_code: string;
  security_id: string;
}

export default function AccountHoldings() {
  const {
    holdings,
    totalCount,
    currentPage,
    itemsPerPage,
    totalGains,
    totalLosses,
  } = useSelector((state: RootState) => state.holdingState);
  const {
    data: dbUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();
  const userId = dbUser?.id;

  const { data, isLoading } = useGetAllHoldingsQuery(
    {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      userId,
    },
    { skip: !userId || !isAuthenticated }
  );

  const { data: allHoldings, isLoading: isAllHoldingsLoading } =
    useGetAllHoldingsQuery({ userId }, { skip: !userId || !isAuthenticated });

  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const dispatch = useDispatch();

  const calculateGainLoss = (holding: Holding) => {
    const gainLoss =
      holding.institution_value - holding.cost_basis * holding.quantity;
    const gainLossPercentage =
      (gainLoss / (holding.cost_basis * holding.quantity)) * 100;
    return { gainLoss, gainLossPercentage };
  };

  const handleHoldingClick = (holding: Holding) => {
    setSelectedHolding(holding);
  };

  const handleCloseModal = () => {
    setSelectedHolding(null);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  useEffect(() => {
    if (data) {
      dispatch(setHoldings(data.results));
      dispatch({ type: "holdings/setTotalCount", payload: data.count });
    }
  }, [data, dispatch, currentPage]);

  useEffect(() => {
    if (allHoldings) {
      const { totalGains, totalLosses } = allHoldings.results.reduce(
        (acc, holding) => {
          const { gainLoss } = calculateGainLoss(holding);
          if (gainLoss > 0) {
            acc.totalGains += gainLoss;
          } else {
            acc.totalLosses += Math.abs(gainLoss);
          }
          return acc;
        },
        { totalGains: 0, totalLosses: 0 }
      );
      dispatch(setTotalGainsLosses({ totalGains, totalLosses }));
    }
  }, [allHoldings, dispatch]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Account Holdings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                {formatAmount(totalGains)} {holdings[0]?.iso_currency_code}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Losses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                {formatAmount(totalLosses)} {holdings[0]?.iso_currency_code}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-gray-100 rounded-t-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-neutral-800">
                Holdings Summary
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search holdings..."
                  className="pl-10 bg-white w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 bg-white rounded-b-lg">
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Price As Of</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Cost Basis</TableHead>
                      <TableHead className="text-right">
                        Current Price
                      </TableHead>
                      <TableHead className="text-right">
                        Current Value
                      </TableHead>
                      <TableHead className="text-right">Gain/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings?.length > 0 ? (
                      holdings?.map((holding: Holding) => {
                        const { gainLoss, gainLossPercentage } =
                          calculateGainLoss(holding);
                        return (
                          <TableRow
                            key={holding.id}
                            onClick={() => handleHoldingClick(holding)}
                            className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                          >
                            <TableCell>
                              {formatDate(holding.institution_price_as_of)}
                            </TableCell>
                            <TableCell className="text-right">
                              {holding.quantity.toFixed(4)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(holding.cost_basis)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(holding.institution_price)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(holding.institution_value)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`font-medium ${
                                  gainLoss >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {formatAmount(gainLoss)} (
                                {gainLossPercentage.toFixed(2)}%)
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No holdings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / itemsPerPage)}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={(value) => dispatch(setItemsPerPage(value))}
            />
          </CardContent>
        </Card>
      </div>
      {selectedHolding && (
        <HoldingDetail holding={selectedHolding} onClose={handleCloseModal} />
      )}
    </div>
  );
}
