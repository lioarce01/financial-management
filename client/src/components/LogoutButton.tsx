"use client";

import { resetPlaidState } from "@/app/redux/slices/plaidSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetPlaidState());
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  return (
    <>
      {isAuthenticated && (
        <button
          className="py-1 px-4 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 text-white rounded"
          onClick={handleLogout}
        >
          <span>Logout</span>
        </button>
      )}
    </>
  );
};

export default LogoutButton;
