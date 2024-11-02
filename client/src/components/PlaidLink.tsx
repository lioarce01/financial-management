"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlaidLink } from "react-plaid-link";
import { RootState } from "@/app/redux/store/store";
import {
  useCreateLinkTokenMutation,
  useExchangeTokenMutation,
  useGetAccountsQuery,
} from "@/app/redux/api/plaid";
import {
  setLinkToken,
  setLinkLoading,
  setLinkError,
  setAccounts,
  setExchanging,
  setExchangeError,
} from "@/app/redux/slices/plaidSlice";
import { setUser } from "@/app/redux/slices/userSlice";
import AuthButtons from "./AuthButtons";
import { useFetchUser } from "@/hooks/useFetchUser";
import { Button } from "./ui/button";

export default function PlaidLink() {
  const dispatch = useDispatch();
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  const {
    linkToken,
    isLinkLoading,
    linkError,
    isExchanging,
    exchangeError,
    accounts,
  } = useSelector((state: RootState) => state.plaid);

  const {
    data: dbUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();

  const [createLinkToken] = useCreateLinkTokenMutation();
  const [exchangeToken] = useExchangeTokenMutation();

  const { refetch: refetchAccounts } = useGetAccountsQuery(dbUser?.id ?? "", {
    skip: !dbUser?.id || !isAuthenticated,
  });

  const generateToken = useCallback(async () => {
    if (!dbUser?.email || !dbUser?.name) {
      console.log("Missing user data for token generation");
      return;
    }

    try {
      dispatch(setLinkLoading(true));
      dispatch(setLinkError(null));

      console.log("Generating link token for:", dbUser.email);
      const response = await createLinkToken({
        email: dbUser.email,
        name: dbUser.name,
        auth0Id: dbUser.auth0Id,
      }).unwrap();

      console.log("Link token generated successfully");
      dispatch(setLinkToken(response.linkToken));

      dispatch(
        setUser({ id: dbUser.id, email: dbUser.email, name: dbUser.name })
      );

      await refetchAccounts();
    } catch (error) {
      console.error("Error generating link token:", error);
      dispatch(
        setLinkError(
          error instanceof Error ? error.message : "Failed to create link token"
        )
      );
    } finally {
      dispatch(setLinkLoading(false));
    }
  }, [dbUser, createLinkToken, dispatch, refetchAccounts]);

  const onSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      if (dbUser?.id) {
        try {
          dispatch(setExchanging(true));
          console.log("Exchanging public token:", public_token);
          console.log("Exchange metadata:", metadata);

          const result = await exchangeToken({
            public_token,
            userId: dbUser.id,
          }).unwrap();

          console.log("Exchange result:", result);
          dispatch(setExchangeError(null));

          await refetchAccounts();
        } catch (error) {
          console.error("Error exchanging token:", error);
          dispatch(
            setExchangeError(
              error instanceof Error
                ? error.message
                : "Failed to exchange token"
            )
          );
        } finally {
          dispatch(setExchanging(false));
        }
      } else {
        console.error("User ID is not available for token exchange");
        dispatch(setExchangeError("User ID is not available"));
      }
    },
    [exchangeToken, dbUser, dispatch, refetchAccounts]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  useEffect(() => {
    if (
      isAuthenticated &&
      dbUser &&
      !linkToken &&
      !isLinkLoading &&
      !initializationAttempted &&
      dbUser.id
    ) {
      setInitializationAttempted(true);
      generateToken();
    }
  }, [
    isAuthenticated,
    dbUser,
    linkToken,
    isLinkLoading,
    dbUser?.id,
    generateToken,
    initializationAttempted,
  ]);

  useEffect(() => {
    if (accounts.length > 0) {
      dispatch(setAccounts(accounts));
    }
  }, [accounts, dispatch]);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <h1>You need to log in to connect your bank account</h1>
        <AuthButtons />
      </div>
    );
  }

  if (linkError || exchangeError) {
    return (
      <div className="text-red-500">
        <p>{linkError || exchangeError || !accounts}</p>
        <button
          onClick={generateToken}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Button
        className="w-full mt-4 bg-black rounded text-white hover:bg-gray-800 transition-all duration-300 ease-in-out"
        onClick={() => open()}
        disabled={!ready || isLinkLoading || isExchanging}
      >
        {isLinkLoading
          ? "Loading..."
          : isExchanging
          ? "Connecting..."
          : "Connect Bank Account"}
      </Button>
    </div>
  );
}
