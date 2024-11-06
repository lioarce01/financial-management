import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <>
      <button
        className="py-1 px-4 bg-gray-50 hover:bg-gray-200 transition-all duration-300 text-neutral-900 rounded"
        onClick={handleLogin}
      >
        <span>Login</span>
      </button>
    </>
  );
};

export default LoginButton;
