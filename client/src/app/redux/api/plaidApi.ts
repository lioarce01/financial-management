import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LinkTokenResponse {
  link_token: string;
}

interface ExchangeTokenResponse {
  access_token: string;
}

interface Account {
  account_id: string;
  name: string;
  type: string;
  subtype: string;
  balances: {
    current: number;
    available: number;
  };
}

interface Transaction {
  transaction_id: string;
  name: string;
  amount: number;
  date: string;
  category: string[];
}

export const plaidApi = createApi({
  reducerPath: "plaidApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    createLinkToken: builder.mutation<LinkTokenResponse, void>({
      query: () => ({
        url: "create_link_token",
        method: "POST",
      }),
    }),
    exchangePublicToken: builder.mutation<
      ExchangeTokenResponse,
      { public_token: string }
    >({
      query: (body) => ({
        url: "exchange_public_token",
        method: "POST",
        body,
      }),
    }),
    setAccessToken: builder.mutation<
      { success: boolean },
      { access_token: string }
    >({
      query: (body) => ({
        url: "set_access_token",
        method: "POST",
        body,
      }),
    }),
    getAccounts: builder.query<Account[], void>({
      query: () => "accounts",
    }),
    getTransactions: builder.query<Transaction[], void>({
      query: () => "transactions",
    }),
  }),
});

export const {
  useCreateLinkTokenMutation,
  useExchangePublicTokenMutation,
  useSetAccessTokenMutation,
  useGetAccountsQuery,
  useGetTransactionsQuery,
} = plaidApi;
