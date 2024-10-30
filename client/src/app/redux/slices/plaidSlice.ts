import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaidState {
  publicToken: string | null;
  accessToken: string | null;
}

const initialState: PlaidState = {
  publicToken: null,
  accessToken: null,
};

const plaidSlice = createSlice({
  name: "plaid",
  initialState,
  reducers: {
    setPublicToken(state, action: PayloadAction<string>) {
      state.publicToken = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearTokens(state) {
      state.publicToken = null;
      state.accessToken = null;
    },
  },
});

export const { setPublicToken, setAccessToken, clearTokens } =
  plaidSlice.actions;
export default plaidSlice.reducer;
