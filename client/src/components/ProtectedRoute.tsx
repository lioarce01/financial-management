import { useFetchUser } from "@/hooks/useFetchUser";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useFetchUser();

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/404");
    }
  }, [isAuthenticated]);
  return <>{children}</>;
};

export default ProtectedRoute;
