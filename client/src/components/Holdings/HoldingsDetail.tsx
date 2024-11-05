"use client";

import React, { useState } from "react";
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
import { ArrowDownIcon, ArrowUpIcon, ClipboardCheck } from "lucide-react";
import copy from "copy-to-clipboard";

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
  security_name?: string;
  logo_url?: string;
}

interface HoldingDetailProps {
  holding: Holding;
  onClose: () => void;
}

export default function HoldingDetail({
  holding,
  onClose,
}: HoldingDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(holding.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateGainLoss = () => {
    const gainLoss =
      holding.institution_value - holding.cost_basis * holding.quantity;
    const gainLossPercentage =
      (gainLoss / (holding.cost_basis * holding.quantity)) * 100;
    return { gainLoss, gainLossPercentage };
  };

  const { gainLoss, gainLossPercentage } = calculateGainLoss();

  const totalGains = gainLoss > 0 ? gainLoss : 0;
  const totalLosses = gainLoss < 0 ? gainLoss : 0;

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px] bg-gray-50 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">Holding Details</div>
            <button onClick={handleCopy}>
              <ClipboardCheck />
            </button>
            {copied && (
              <div className="absolute top-0 right-0 text-neutral-800 mt-1 text-sm px-3 font-normal rounded shadow-md">
                Copied
              </div>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">{`Details for holding ${holding.id}`}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Quantity</span>
              <span className="block font-medium">
                {holding.quantity.toFixed(8)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Current Value</span>
              <span className="block font-medium">
                {formatAmount(holding.institution_value)}{" "}
                {holding.iso_currency_code}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Cost Basis</span>
              <span className="block font-medium">
                {formatAmount(holding.cost_basis)} {holding.iso_currency_code}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Current Price</span>
              <span className="block font-medium">
                {formatAmount(holding.institution_price)}{" "}
                {holding.iso_currency_code}
              </span>
            </div>

            <div>
              <span className="text-sm text-gray-500">Gain/Loss</span>
              <span
                className={`block font-medium ${
                  gainLoss >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {gainLoss >= 0 ? (
                  <ArrowUpIcon className="inline mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="inline mr-1 h-4 w-4" />
                )}
                {formatAmount(Math.abs(gainLoss))} {holding.iso_currency_code} (
                {gainLossPercentage.toFixed(2)}%)
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Price As Of</span>
              <span className="block font-medium">
                {formatDate(holding.institution_price_as_of)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Holding ID</span>
              <span className="block text-sm break-all">
                {holding.id ?? "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Security ID</span>
              <span className="block font-sm text-xs break-all">
                {holding.security_id}
              </span>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <span className="block text-sm text-gray-500">
              Additional Information
            </span>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="block text-xs text-gray-400">Account ID</span>
                <span className="block text-sm break-all">
                  {holding.accountId}
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
