"use client";

import { useEffect } from "react";
import {
  useGetAccountsQuery,
  useGetTransactionsQuery,
} from "@/app/redux/api/plaidApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useGetAccountsQuery();
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useGetTransactionsQuery();

  useEffect(() => {
    if (accountsError || transactionsError) {
      toast({
        title: "Error al cargar los datos",
        description: "Por favor, inténtelo de nuevo",
        variant: "destructive",
      });
    }
  }, [accountsError, transactionsError, toast]);

  if (isLoadingAccounts || isLoadingTransactions) {
    return <div>Cargando datos financieros...</div>;
  }

  const totalBalance =
    accounts?.reduce(
      (sum: any, account: any) => sum + account.balances.current,
      0
    ) || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Financiero</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cuentas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {accounts?.map((account: any) => (
                <div key={account.account_id} className="mb-2">
                  <p className="font-semibold">{account.name}</p>
                  <p>${account.balances.current.toFixed(2)}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {transactions?.map((transaction: any) => (
                <div
                  key={transaction.transaction_id}
                  className="mb-2 p-2 border-b"
                >
                  <p className="font-semibold">{transaction.name}</p>
                  <p
                    className={
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
