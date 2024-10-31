import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store/store";
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
  const { user } = useAuth0();
  const dispatch = useDispatch();

  const { linkToken, isLinkLoading, linkError, isExchanging, exchangeError } =
    useSelector((state: RootState) => state.plaid);

  const [createLinkToken] = useCreateLinkTokenMutation();
  const [exchangeToken] = useExchangeTokenMutation();
  const { id: userId, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const { refetch } = useGetAccountsQuery(userId ?? "", {
    skip: !userId || !isAuthenticated,
  });

  const generateToken = useCallback(async () => {
    if (user?.email && user?.name) {
      try {
        dispatch(setLinkLoading(true));
        const response = await createLinkToken({
          email: user.email,
          name: user.name as string,
        }).unwrap();

        dispatch(setLinkToken(response.linkToken));

        dispatch(
          setUser({
            id: response.userId,
            email: user.email,
            name: user.name as string,
          })
        );
      } catch (error) {
        dispatch(
          setLinkError(
            error instanceof Error
              ? error.message
              : "Failed to create link token"
          )
        );
      } finally {
        dispatch(setLinkLoading(false));
      }
    }
  }, [user, createLinkToken, dispatch]);

  useEffect(() => {
    if (user && !linkToken && !isLinkLoading) {
      generateToken();
    }
  }, [user, linkToken, isLinkLoading, generateToken]);

  const onSuccess = useCallback(
    async (public_token: string) => {
      if (userId) {
        try {
          dispatch(setExchanging(true));
          await exchangeToken({
            public_token,
            userId,
          }).unwrap();
          dispatch(setExchangeError(null));

          refetch();
        } catch (error) {
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
      }
    },
    [exchangeToken, userId, dispatch, refetch]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  if (!user) {
    return (
      <div className="text-center">
        <h1>You need to log in to connect your bank account</h1>
        <AuthButtons />
      </div>
    );
  }

  if (linkError || exchangeError) {
    return <div className="text-red-500">{linkError || exchangeError}</div>;
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
