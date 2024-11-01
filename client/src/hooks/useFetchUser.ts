"use client";

import { useAuth0 } from "@auth0/auth0-react";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
} from "@/app/redux/api/user";
import { useState, useEffect } from "react";

export function useFetchUser() {
  const {
    isAuthenticated,
    user: auth0User,
    isLoading: isAuth0Loading,
  } = useAuth0();
  const [createUser] = useCreateUserMutation();
  const [isUserCreated, setIsUserCreated] = useState(false);

  // Only fetch the database user if the user exists in Auth0 and is created in the DB
  const {
    data: dbUser,
    isLoading: isDbLoading,
    error: dbError,
    refetch,
    isFetching,
  } = useGetUserByIdQuery(auth0User?.email ?? "", {
    skip: !auth0User?.email || !isUserCreated,
  });

  useEffect(() => {
    const ensureUserExists = async () => {
      if (!auth0User?.email || !auth0User?.name || !isAuthenticated) return;

      try {
        // If the user doesn't exist in the database, create them
        if (!isUserCreated && !dbUser) {
          const result = await createUser({
            name: auth0User.name,
            email: auth0User.email,
            auth0Id: auth0User.email!,
          }).unwrap();
          setIsUserCreated(true);
          return result;
        }
      } catch (error) {
        console.error("Error ensuring user exists:", error);
      }
    };

    ensureUserExists();
  }, [auth0User, isAuthenticated, isUserCreated, dbUser, createUser]);

  return {
    data: dbUser,
    isLoading: isAuth0Loading || isDbLoading,
    error: dbError,
    refetch,
    isAuthenticated,
    isFetching,
    isUserCreated,
  };
}
