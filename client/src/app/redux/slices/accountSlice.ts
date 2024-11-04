import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountState {
  accounts: any[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: AccountState = {
  accounts: [],
  totalCount: 0,
  currentPage: 1,
  itemsPerPage: 7,
};

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<any[]>) => {
      state.accounts = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
  },
});

export const { setAccounts, setTotalCount, setCurrentPage, setItemsPerPage } =
  accountsSlice.actions;

export default accountsSlice.reducer;
