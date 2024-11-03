import React from "react";
import { User } from "lucide-react";
import { useFetchUser } from "@/hooks/useFetchUser";
import Spinner from "./Spinner";

const UserMenu = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();

  return (
    <div>
      {isUserLoading ? (
        <Spinner />
      ) : (
        isAuthenticated && (
          <div>
            <div className="flex space-x-3">
              <User className="h-8 w-8 text-white" />
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UserMenu;
