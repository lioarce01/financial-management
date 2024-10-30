import { configureStore } from "@reduxjs/toolkit";
import { plaidApi } from "../api/plaidApi";
import accountReducer from "../slices/accountSlice";

export const store = configureStore({
  reducer: {
    [plaidApi.reducerPath]: plaidApi.reducer,
    account: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(plaidApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
