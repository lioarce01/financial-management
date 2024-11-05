import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export const totalAccountsBalance = (accounts: any[]) => {
  const total = accounts.reduce((acc, account) => acc + account.balance, 0);

  return total;
};

export const monthlySpent = (transactions: any[]) => {
  const res = Math.abs(
    transactions?.reduce(
      (acc, transaction) =>
        acc + (transaction.amount < 0 ? transaction.amount : 0),
      0
    ) || 0
  );

  return res;
};

export const monthlyIncome = (transactions: any[]) => {
  const res = Math.abs(
    transactions?.reduce(
      (acc, transaction) =>
        acc + (transaction.amount > 0 ? transaction.amount : 0),
      0
    ) || 0
  );

  return res;
};
