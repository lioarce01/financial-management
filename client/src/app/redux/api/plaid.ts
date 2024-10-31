import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plaidApi = createApi({
  reducerPath: "plaidApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/plaid",
  }),
  endpoints: (builder) => ({
    createLinkToken: builder.mutation<
      { linkToken: string; userId: string },
      { email: string; name: string }
    >({
      query: (credentials) => ({
        url: "/link-token",
        method: "POST",
        body: credentials,
      }),
    }),
    exchangeToken: builder.mutation<
      { success: boolean },
      { public_token: string; userId: string }
    >({
      query: (data) => ({
        url: "/exchange-token",
        method: "POST",
        body: data,
      }),
    }),
    getAccounts: builder.query<any[], string>({
      query: (userId) => `/accounts/${userId}`,
    }),
  }),
});

export const {
  useCreateLinkTokenMutation,
  useExchangeTokenMutation,
  useGetAccountsQuery,
} = plaidApi;
