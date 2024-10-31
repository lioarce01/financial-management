"use client";

import { Provider } from "react-redux";
import "./globals.css";
import { store } from "./redux/store/store";
import { Auth0Provider } from "@auth0/auth0-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        <Auth0Provider
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ""}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? ""}
          authorizationParams={{
            redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            scope:
              process.env.NEXT_PUBLIC_AUTH0_SCOPE || "openid profile email",
          }}
        >
          <body>{children}</body>
        </Auth0Provider>
      </Provider>
    </html>
  );
}
