import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface CreateLinkTokenRequest {
  email: string;
  name: string;
  auth0Id: string;
}

interface CreateLinkTokenResponse {
  linkToken: string;
  userId: string;
}

interface ExchangeTokenRequest {
  public_token: string;
  userId: string;
}

export const plaidApi = createApi({
  reducerPath: "plaidApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  }),
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({
    createLinkToken: builder.mutation<
      CreateLinkTokenResponse,
      CreateLinkTokenRequest
    >({
      query: (credentials) => ({
        url: "/plaid/link-token",
        method: "POST",
        body: credentials,
      }),
    }),
    exchangeToken: builder.mutation<any, ExchangeTokenRequest>({
      query: (data) => ({
        url: "/plaid/exchange-token",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Accounts"],
    }),
    getAccounts: builder.query<any[], string>({
      query: (userId) => `/plaid/accounts/${userId}`,
      providesTags: ["Accounts"],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response.accounts) {
          return response.accounts;
        }
        return [];
      },
    }),
  }),
});

export const {
  useCreateLinkTokenMutation,
  useExchangeTokenMutation,
  useGetAccountsQuery,
} = plaidApi;
