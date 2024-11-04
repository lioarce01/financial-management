import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { formatAmount } from "@/lib/utils";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import copy from "copy-to-clipboard";
import { ClipboardCheck } from "lucide-react";

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

interface AccountDetailProps {
  account: Account;
  onClose: () => void;
}

export default function AccountDetail({
  account,
  onClose,
}: AccountDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(account.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px] bg-gray-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold flex justify-between">
            <div>Account Details</div>
            <button onClick={handleCopy}>
              <ClipboardCheck />
            </button>
            {copied && (
              <div className="absolute top-0 right-0 text-neutral-800 mt-1 text-sm px-3 font-normal rounded shadow-md">
                Copied
              </div>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">{`Details for account ${account.id}`}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Account Name</span>
              <span className="block font-medium">{account.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Official Name</span>
              <span className="block font-medium">{account.officialName}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Type</span>
              <span className="block font-medium capitalize">
                {account.type}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Subtype</span>
              <span className="block font-medium capitalize">
                {account.subtype}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Mask</span>
              <span className="block font-medium">****{account.mask}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Balance</span>
              <span className="block font-medium">
                {formatAmount(account.balance)} {account.currency}
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
                <span className="block text-sm break-all">{account.id}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">
                  Plaid Account ID
                </span>
                <span className="block text-sm break-all">
                  {account.plaidAccountId}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">User ID</span>
                <span className="block text-sm break-all">
                  {account.userId}
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
