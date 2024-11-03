import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { plaidApi } from "../api/plaid";
import { userApi } from "../api/user";
import plaidReducer from "../slices/plaidSlice";
import userReducer from "../slices/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import transactionReducer from "../slices/transactionSlice";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "plaid"],
};

const rootReducer = combineReducers({
  [plaidApi.reducerPath]: plaidApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  plaid: plaidReducer,
  user: userReducer,
  transactionState: transactionReducer,
});

const localStorage = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: localStorage,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(plaidApi.middleware, userApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
