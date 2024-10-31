import { configureStore } from "@reduxjs/toolkit";
import { plaidApi } from "../api/plaid";
import { userApi } from "../api/user";
import plaidReducer from "../slices/plaidSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    [plaidApi.reducerPath]: plaidApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    plaid: plaidReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(plaidApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
