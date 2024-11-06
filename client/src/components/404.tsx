import React from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-center">
      <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
      <p className="text-xl text-gray-200 mb-8">Oops! Page not found.</p>
      <button
        onClick={handleRedirect}
        className="px-6 py-3 text-white bg-neutral-800 rounded hover:bg-neutral-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
