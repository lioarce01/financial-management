"use client";

import PlaidLinkButton from "./components/PlaidLinkButton";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <h1>PLAID</h1>
      <PlaidLinkButton />
    </div>
  );
}
