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

  const auth0Id = auth0User?.email || null;

  const {
    data: dbUser,
    isLoading: isDbLoading,
    error: dbError,
    refetch,
  } = useGetUserByIdQuery(auth0Id ?? "", {
    skip: !auth0Id || !isUserCreated,
  });

  useEffect(() => {
    const ensureUserExists = async () => {
      if (!auth0Id || !auth0User?.name || !isAuthenticated) return;

      try {
        // Only attempt to create the user if they are not yet created
        if (!isUserCreated && !dbUser) {
          const result = await createUser({
            name: auth0User.name,
            email: auth0User.email,
            auth0Id, // Use auth0Id from Auth0 sub for creation
          }).unwrap();

          // Set isUserCreated to true if the user was successfully created
          setIsUserCreated(true);
          return result;
        }
      } catch (error) {
        console.error("Error ensuring user exists:", error);
      }
    };

    ensureUserExists();
  }, [auth0Id, auth0User, isAuthenticated, isUserCreated, dbUser, createUser]);

  return {
    data: dbUser,
    isLoading: isAuth0Loading || isDbLoading,
    error: dbError,
    refetch,
    isAuthenticated,
    isFetching: isAuth0Loading || isDbLoading,
    isUserCreated,
  };
}
