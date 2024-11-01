"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store/store";
import { useGetAccountsQuery } from "@/app/redux/api/plaid";
import { setAccounts } from "@/app/redux/slices/plaidSlice";

export default function AccountsList() {
  const dispatch = useDispatch();
  const { id: userId, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const { accounts } = useSelector((state: RootState) => state.plaid);

  const { data, isLoading, error } = useGetAccountsQuery(userId ?? "", {
    skip: !userId || !isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      dispatch(setAccounts(data));
    }
  }, [data, dispatch]);

  if (!userId || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading accounts</div>;
  }

  if (!accounts.length) {
    return <div>No accounts connected</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Connected Accounts</h2>
      <div className="grid gap-4">
        {accounts.map((account: any) => (
          <div key={account.id} className="p-4 border rounded-lg shadow-sm">
            <div className="font-semibold">{account.name}</div>
            <div className="text-sm text-gray-600">{account.officialName}</div>
            <div className="mt-2">
              <span className="font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.currency || "USD",
                }).format(account.balance || 0)}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {account.type} - {account.subtype}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
