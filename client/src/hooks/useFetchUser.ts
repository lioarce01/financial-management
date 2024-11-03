"use client";

import { useAuth0 } from "@auth0/auth0-react";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
} from "@/app/redux/api/user";
import { useEffect, useState } from "react";

export function useFetchUser() {
  const {
    isAuthenticated,
    user: auth0User,
    isLoading: isAuth0Loading,
  } = useAuth0();
  const [createUser] = useCreateUserMutation();
  const auth0Id = auth0User?.email || "";
  const [hasAttemptedUserCreation, setHasAttemptedUserCreation] =
    useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false); // New state to track user creation

  const {
    data: dbUser,
    isLoading: isDbLoading,
    error: dbError,
    refetch: refetchUser, // Get refetch function
  } = useGetUserByIdQuery(auth0Id, {
    skip: !auth0Id || !isAuthenticated,
  });

  useEffect(() => {
    const createUserIfNotExists = async () => {
      // Check if the user is authenticated and if the user does not exist in the database
      if (
        isAuthenticated &&
        !dbUser &&
        auth0User?.name &&
        !hasAttemptedUserCreation
      ) {
        try {
          await createUser({
            name: auth0User.name,
            email: auth0User.email,
            auth0Id,
          }).unwrap();

          console.log("User created:", {
            name: auth0User.name,
            email: auth0User.email,
            auth0Id,
          });
          setHasAttemptedUserCreation(true); // Mark that user creation has been attempted
          setIsUserCreated(true); // Mark that the user was created
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    createUserIfNotExists();
  }, [
    isAuthenticated,
    dbUser,
    createUser,
    auth0User,
    auth0Id,
    hasAttemptedUserCreation,
  ]);

  // Refetch user data after the user is created
  useEffect(() => {
    if (isUserCreated) {
      refetchUser(); // Refetch the user data after creation
      setIsUserCreated(false); // Reset the creation flag
    }
  }, [isUserCreated, refetchUser]);

  return {
    data: dbUser,
    isLoading: isAuth0Loading || isDbLoading,
    error: dbError,
    isAuthenticated,
  };
}
