"use client";

import { Provider } from "react-redux";
import "./globals.css";
import { store, persistor } from "./redux/store/store";
import { Auth0Provider } from "@auth0/auth0-react";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { CustomAuth0Provider } from "@/components/CustomAuth0Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CustomAuth0Provider>{children}</CustomAuth0Provider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
