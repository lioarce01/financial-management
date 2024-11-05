import {
  ArrowUpDown,
  Landmark,
  WalletCards,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  BadgeDollarSign,
} from "lucide-react";
import React, { useState } from "react";
import PlaidLink from "./PlaidLink";
import UserMenu from "./UserMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`w-${
        isOpen ? "64" : "16"
      } bg-white border-r p-4 transition-all duration-300 min-h-screen flex flex-col`}
    >
      {/* Encabezado del Sidebar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${isOpen ? "" : "hidden"}`}>
          Bankly Hub
        </h2>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-all duration-300"
          onClick={handleClose}
        >
          {isOpen ? (
            <ArrowLeftFromLine className="h-5 w-5" />
          ) : (
            <ArrowRightFromLine className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navegacion */}
      <nav className="space-y-2 flex-grow">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-2 text-sm w-full p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/dashboard" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <WalletCards className="h-5 w-5" />
          {isOpen && <span>Dashboard</span>}
        </Link>
        <Link
          href="/transactions"
          className={`flex items-center space-x-2 text-sm w-full p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/transactions" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <ArrowUpDown className="h-5 w-5" />
          {isOpen && <span>Transactions</span>}
        </Link>
        <Link
          href="/accounts"
          className={`flex items-center space-x-2 text-sm w-full p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/accounts" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <Landmark className="h-5 w-5" />
          {isOpen && <span>Accounts</span>}
        </Link>
        <Link
          href="/holdings"
          className={`flex items-center space-x-2 text-sm w-full p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/holdings" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <BadgeDollarSign className="h-5 w-5" />
          {isOpen && <span>Holdings</span>}
        </Link>
        {isOpen && <PlaidLink />}
      </nav>

      <div className="mt-auto space-y-2">{isOpen && <UserMenu />}</div>
    </div>
  );
};

export default Sidebar;
