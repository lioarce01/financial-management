import { resetPlaidState } from "@/app/redux/slices/plaidSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthButtons: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(resetPlaidState());
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
  };

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      {isAuthenticated ? (
        <button
          className="py-1 px-4 bg-red-500 hover:bg-red-600 transition-all duration-300 text-white rounded"
          onClick={handleLogout}
        >
          <span>Logout</span>
        </button>
      ) : (
        <button
          className="py-1 px-4 bg-green-500 hover:bg-green-600 transition-all duration-300 text-white rounded"
          onClick={handleLogin}
        >
          <span>Login</span>
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
