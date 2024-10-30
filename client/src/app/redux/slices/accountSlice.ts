import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  institutionName: string | null;
  accountName: string | null;
  accountType: string | null;
}

const initialState: AccountState = {
  institutionName: null,
  accountName: null,
  accountType: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setLinkedAccount: (state, action: PayloadAction<AccountState>) => {
      state.institutionName = action.payload.institutionName;
      state.accountName = action.payload.accountName;
      state.accountType = action.payload.accountType;
    },
  },
});

export const { setLinkedAccount } = accountSlice.actions;
export default accountSlice.reducer;
