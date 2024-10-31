"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/app/redux/slices/userSlice";
import PlaidLink from "@/components/PlaidLink";
import AccountsList from "@/components/AccountsList";
import AuthButtons from "@/components/AuthButtons";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(
        setUser({
          id: user.sub || "",
          email: user.email || "",
          name: user.name || "",
        })
      );
    } else {
      dispatch(clearUser());
    }
  }, [isAuthenticated, user, dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Bank Account Connection</h1>

      <div className="space-y-8">
        <AuthButtons />
        <PlaidLink />
        {isAuthenticated && <AccountsList />}
      </div>
    </main>
  );
}
