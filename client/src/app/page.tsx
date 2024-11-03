"use client";

import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="w-full min-h-screen text-white">
      <Navbar />

      {/* Hero Section with Gradient Background */}
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-black to-neutral-900">
        <h1 className="text-6xl md:text-8xl font-bold mb-2">Bankly</h1>
        <p className="text-2xl text-neutral-500">Your Finances Centralized</p>
      </div>

      {/* Description Section */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4 text-center md:text-justify">
        <h2 className="text-3xl font-semibold mb-4">What is Bankly?</h2>
        <p className="text-lg text-black max-w-2xl mb-6">
          Bankly is your go-to finance management app that centralizes all your
          bank accounts in one place. Keep track of your balances, view
          transactions, and manage your monthly finances effortlessly.
        </p>

        <h3 className="text-2xl font-semibold mb-2">Key Features</h3>
        <ul className="list-inside mb-6 text-black list-none">
          <li>
            🔹 Centralized Account Management: Link all your bank accounts and
            view them in a single dashboard.
          </li>
          <li>
            🔹 Real-time Balance Updates: Get live updates of your account
            balances to stay informed.
          </li>
          <li>
            🔹 Transaction History: Easily access and analyze your past
            transactions to track your spending habits.
          </li>
          <li>
            🔹 Budgeting Tools: Set budgets for different categories and monitor
            your progress in real time.
          </li>
          <li>
            🔹 Financial Insights: Receive personalized insights and tips based
            on your financial behavior.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mb-2">Why Choose Bankly?</h3>
        <p className="text-lg text-black max-w-2xl mb-4">
          With Bankly, you can streamline your financial activities, make
          informed decisions, and gain insights into your spending habits. Our
          intuitive design makes it easy for anyone to use, regardless of their
          financial knowledge.
        </p>

        <p className="text-lg text-black max-w-2xl mb-4">
          Join thousands of satisfied users who have taken control of their
          finances. Whether you want to save for a vacation, pay off debt, or
          simply get a better grasp of your financial situation, Bankly is here
          to help!
        </p>

        <p className="text-lg font-semibold text-black max-w-2xl">
          Take the first step towards financial freedom. Start using Bankly
          today!
        </p>
      </div>

      {/* Footer Section */}
      <div className="bg-neutral-900 text-center py-6">
        <p className="text-lg text-gray-300">
          © 2024 Bankly. All rights reserved. | Your trusted partner in
          financial management.
        </p>
      </div>
    </main>
  );
}
