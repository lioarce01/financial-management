import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/app/redux/slices/userSlice";
import { resetPlaidState } from "@/app/redux/slices/plaidSlice";
import { RootState } from "@/app/redux/store/store";
import { useFetchUser } from "@/hooks/useFetchUser";

interface AuthStateManagerProps {
  children: React.ReactNode;
}

export const AuthStateManager: React.FC<AuthStateManagerProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.user);
  const { data: user, isLoading, isAuthenticated } = useFetchUser();

  useEffect(() => {
    if (user && isAuthenticated && !reduxUser.isAuthenticated) {
      dispatch(
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
        })
      );
    }
  }, [user, isAuthenticated, reduxUser.isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && reduxUser.isAuthenticated) {
      dispatch(clearUser());
      dispatch(resetPlaidState());
    }
  }, [isAuthenticated, reduxUser.isAuthenticated, dispatch]);

  return <>{children}</>;
};
