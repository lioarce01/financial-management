import { Auth0Provider } from "@auth0/auth0-react";
import { AuthStateManager } from "./AuthManager";

interface AuthStateManagerProps {
  children: React.ReactNode;
}

export const CustomAuth0Provider: React.FC<AuthStateManagerProps> = ({
  children,
}) => {
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope:
          process.env.NEXT_PUBLIC_AUTH0_SCOPE ||
          "openid profile email offline_access",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <AuthStateManager>{children}</AuthStateManager>
    </Auth0Provider>
  );
};
