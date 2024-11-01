import React, { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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
  setExchanging,
  setExchangeError,
} from "@/app/redux/slices/plaidSlice";
import { setUser } from "@/app/redux/slices/userSlice";
import AuthButtons from "./AuthButtons";

export default function PlaidLink() {
  const { user, isAuthenticated, isLoading: isAuth0Loading } = useAuth0();
  const dispatch = useDispatch();
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  const { linkToken, isLinkLoading, linkError, isExchanging, exchangeError } =
    useSelector((state: RootState) => state.plaid);

  const [createLinkToken] = useCreateLinkTokenMutation();
  const [exchangeToken] = useExchangeTokenMutation();

  const { id: userId } = useSelector((state: RootState) => state.user);
  const { refetch } = useGetAccountsQuery(userId ?? "", {
    skip: !userId || !isAuthenticated,
  });

  const generateToken = useCallback(async () => {
    if (!user?.email || !user?.name || !user?.sub) {
      console.log("Missing user data for token generation");
      return;
    }

    try {
      dispatch(setLinkLoading(true));
      dispatch(setLinkError(null));

      console.log("Generating link token for:", user.email);
      const response = await createLinkToken({
        email: user.email,
        name: user.name,
        auth0Id: user.email,
      }).unwrap();

      console.log("Link token generated successfully");
      dispatch(setLinkToken(response.linkToken));

      dispatch(
        setUser({
          id: response.userId,
          email: user.email,
          name: user.name,
        })
      );

      await refetch();
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
  }, [user, createLinkToken, dispatch, refetch]);

  const onSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      if (userId) {
        try {
          dispatch(setExchanging(true));
          console.log("Exchanging public token:", public_token);
          console.log("Exchange metadata:", metadata);

          const result = await exchangeToken({
            public_token,
            userId,
          }).unwrap();

          console.log("Exchange result:", result);
          dispatch(setExchangeError(null));
          await refetch();
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
    [exchangeToken, userId, dispatch, refetch]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      !linkToken &&
      !isLinkLoading &&
      !initializationAttempted
    ) {
      setInitializationAttempted(true);
      generateToken();
    }
  }, [
    isAuthenticated,
    user,
    linkToken,
    isLinkLoading,
    generateToken,
    initializationAttempted,
  ]);

  if (isAuth0Loading) {
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
        <p>{linkError || exchangeError}</p>
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
    <button
      onClick={() => open()}
      disabled={!ready || isLinkLoading || isExchanging}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
    >
      {isLinkLoading
        ? "Loading..."
        : isExchanging
        ? "Connecting..."
        : "Connect your bank account"}
    </button>
  );
}
