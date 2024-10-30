import { formatAmount } from "@/lib/utils";
import React from "react";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="">
      <div className="">{/* CHART*/}</div>
      <div className="flex flex-col gap-6">
        <h2 className="">Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="">Total Current Balance</p>
          <p className="">{formatAmount(totalCurrentBalance)}</p>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
