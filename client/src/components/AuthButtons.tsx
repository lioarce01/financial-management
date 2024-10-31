import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const AuthButtons: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
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
        <button onClick={handleLogout}>Cerrar Sesión</button>
      ) : (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      )}
    </div>
  );
};

export default AuthButtons;
