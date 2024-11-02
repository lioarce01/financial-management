import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    getAccounts: builder.query<any[], string>({
      query: (userId) => `users/accounts/${userId}`,
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
    getTransactions: builder.query<any[], string>({
      query: (userId) => `users/transactions/${userId}`,
      providesTags: ["Transactions"],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response.transactions) {
          return response.transactions;
        }
        return [];
      },
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
