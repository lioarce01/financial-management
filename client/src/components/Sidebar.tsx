import { ArrowUpDown, Landmark, WalletCards } from "lucide-react";
import React from "react";
import PlaidLink from "./PlaidLink";
import UserMenu from "./UserMenu";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-6">Finance Hub</h2>
        {/* UserMenu */}
        <UserMenu />
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-sm w-full p-2 rounded-lg bg-blue-50"
          >
            <WalletCards className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/transactions"
            className="flex items-center space-x-2 text-sm w-full p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Transactions</span>
          </Link>
          <Link
            href="/accounts"
            className="flex items-center space-x-2 text-sm w-full p-2 rounded-lg hover:bg-gray-100"
          >
            <Landmark className="h-4 w-4" />
            <span>Accounts</span>
          </Link>
          <PlaidLink />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
