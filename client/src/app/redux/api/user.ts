import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface getTransactionsArgs {
  offset: number;
  limit: number;
  userId: string;
}

interface GetTransactionsResponse {
  results: any[];
  count: number;
}

interface GetAccountsArgs {
  offset: number;
  limit: number;
  userId: string;
}

interface GetAccountsResponse {
  results: any[];
  count: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  tagTypes: ["Accounts", "Transactions", "User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "users",
    }),

    getUserById: builder.query({
      query: (auth0Id) => `users/${auth0Id}`,
    }),

    createUser: builder.mutation({
      query: (user) => ({
        url: "users/register",
        method: "POST",
        body: user,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),

    updateUser: builder.mutation({
      query: (user) => ({
        url: `users/${user.id}`,
        method: "PUT",
      }),
    }),
    getAccounts: builder.query<GetAccountsResponse, GetAccountsArgs>({
      query: ({ offset = 0, limit = 10, userId }) =>
        `users/accounts/${userId}?offset=${offset}&limit=${limit}`,
      providesTags: ["Accounts"],
    }),
    getTransactions: builder.query<
      GetTransactionsResponse,
      getTransactionsArgs
    >({
      query: ({ offset = 0, limit = 10, userId }) =>
        `users/transactions/${userId}?offset=${offset}&limit=${limit}`,
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAccountsQuery,
  useGetTransactionsQuery,
} = userApi;
