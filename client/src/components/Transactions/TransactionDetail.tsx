"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { formatAmount, formatDate } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Image from "next/image";

interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  transaction_id: string;
  amount: number;
  iso_currency_code: string;
  date: string;
  name: string;
  merchant_name: string;
  pending: boolean;
  payment_channel: string;
  transaction_type: string;
  logo_url: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function TransactionDetail({
  transaction,
  onClose,
}: TransactionDetailProps) {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px] bg-gray-50 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
            {transaction.logo_url && (
              <Image
                src={transaction.logo_url}
                alt={transaction.merchant_name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            Transaction Details
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">{`Details for transaction ${transaction.id}`}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Merchant</span>
              <span className="block font-medium">
                {transaction.merchant_name}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Amount</span>
              <span
                className={`block font-medium ${
                  transaction.amount < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {transaction.amount < 0 ? (
                  <ArrowDownIcon className="inline mr-1 h-4 w-4" />
                ) : (
                  <ArrowUpIcon className="inline mr-1 h-4 w-4" />
                )}
                {formatAmount(Math.abs(transaction.amount))}{" "}
                {transaction.iso_currency_code}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Date</span>
              <span className="block font-medium">
                {formatDate(transaction.date)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`block font-medium ${
                  transaction.pending ? "text-yellow-500" : "text-green-500"
                }`}
              >
                {transaction.pending ? "Pending" : "Completed"}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Category</span>
              <span className="block font-medium capitalize">
                {transaction.transaction_type}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="block font-medium capitalize">
                {transaction.payment_channel}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Transaction ID</span>
              <span className="block font-medium text-xs break-all">
                {transaction.id}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Account ID</span>
              <span className="block font-medium text-xs break-all">
                {transaction.accountId}
              </span>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <span className="block text-sm text-gray-500">
              Additional Information
            </span>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="block text-xs text-gray-400">Created At</span>
                <span className="block text-sm">
                  {formatDate(transaction.createdAt)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">Updated At</span>
                <span className="block text-sm">
                  {formatDate(transaction.updatedAt)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">User ID</span>
                <span className="block text-sm break-all">
                  {transaction.userId}
                </span>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-none bg-neutral-950 hover:bg-neutral-900 text-white hover:text-white transition-all duration-300 ease-in-out"
            onClick={onClose}
          >
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
