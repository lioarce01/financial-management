import { resetPlaidState } from "@/app/redux/slices/plaidSlice";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useDispatch } from "react-redux";

const AuthButtons: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetPlaidState());
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <div className="mt-2">
      {isAuthenticated ? (
        <button
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600"
          onClick={handleLogout}
        >
          <span>Logout</span>
        </button>
      ) : (
        <button
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
          onClick={handleLogin}
        >
          <span>Login</span>
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
