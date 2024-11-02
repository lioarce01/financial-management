import React from "react";
import { User } from "lucide-react";
import AuthButtons from "./AuthButtons";

const UserMenu = ({ user }: any) => {
  return (
    <div className="p-4 border-b">
      <div className="flex space-x-3">
        <User className="h-8 w-8 text-gray-600" />
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <AuthButtons />
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
