"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AccountsList = ({ accounts }: any) => {
  return (
    <Card className="">
      <CardHeader className="bg-blue-50 rounded-t-lg p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-blue-800">
            Connected Accounts
          </CardTitle>
          <Link href="/accounts" className="text-gray-500 hover:underline">
            See all accounts
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50 rounded-b-lg">
        <div className="space-y-4">
          <div className="grid gap-4">
            {accounts?.length > 0 ? (
              accounts.map((account: any) => (
                <div
                  key={account.id}
                  className="p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-lg text-gray-800">
                      {account.name}
                    </div>
                    <div
                      className={`text-lg font-medium ${
                        account.balance < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: account.currency || "USD",
                      }).format(account.balance || 0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {account.officialName}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {account.type} - {account.subtype}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 border rounded-lg shadow-md bg-white text-gray-500">
                No connected accounts found.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsList;
