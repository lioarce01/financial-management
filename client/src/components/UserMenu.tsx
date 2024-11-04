import React, { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { useFetchUser } from "@/hooks/useFetchUser";
import Spinner from "./Spinner";
import AuthButtons from "./AuthButtons";

const UserMenu = ({ position = "bottom" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    data: user,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      {isUserLoading ? (
        <Spinner />
      ) : (
        isAuthenticated && (
          <div>
            <div
              className="flex space-x-3 justify-between items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <div className="bg-gray-200 rounded-full p-2">
                <User className="h-6 w-6 text-black" />
              </div>
              <div>
                {isDropdownOpen ? (
                  <ChevronUp className="h-5 w-5 text-black hover:bg-gray-100" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-black hover:bg-gray-100" />
                )}
              </div>
            </div>

            {isDropdownOpen && (
              <div
                className={`absolute ${
                  position === "bottom" ? "bottom-12" : "top-12"
                } right-0 w-48 bg-white border rounded-lg shadow-lg z-10 p-2 space-y-2`}
              >
                <a
                  href="/profile"
                  className="block p-2 text-sm font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  Profile
                </a>
                <AuthButtons />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default UserMenu;
