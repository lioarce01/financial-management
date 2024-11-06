import React from "react";
import { User, Ellipsis } from "lucide-react";
import { useFetchUser } from "@/hooks/useFetchUser";
import Spinner from "./Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const UserMenu = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useFetchUser();

  return (
    <div className="relative">
      {isUserLoading ? (
        <Spinner />
      ) : (
        isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex space-x-3 items-center cursor-pointer">
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="h-6 w-6 text-black" />
                </div>
                <Ellipsis className="h-5 w-5 text-neutral-600 hover:text-neutral-400 transition-all duration-300" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-50">
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-full" href="/profile">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      )}
    </div>
  );
};

export default UserMenu;
