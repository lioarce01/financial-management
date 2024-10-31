import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),

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
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;
