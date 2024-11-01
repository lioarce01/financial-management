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
    <div>
      {isAuthenticated ? (
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-black/90 transition-all duration-300 ease-in-out"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      ) : (
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-black/90 transition-all duration-300 ease-in-out"
          onClick={handleLogin}
        >
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
