"use client";

import HeaderBox from "@/components/HeaderBox";
import PlaidLinkButton from "../components/PlaidLinkButton";
import TotalBalanceBox from "@/components/TotalBalanceBox";

export default function Home() {
  const loggedIn = { firstName: "Lionel" };
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <HeaderBox
        type="greeting"
        title="Welcome to Plaid Connect"
        user={loggedIn?.firstName || "Guest"}
        subtext="Access and manage your account and transacions efficiently"
      />
      <TotalBalanceBox
        accounts={[]}
        totalBanks={1}
        totalCurrentBalance={1250.35}
      />
    </div>
  );
}
