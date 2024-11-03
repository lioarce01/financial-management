import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TransactionState {
  transactions: any[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: TransactionState = {
  transactions: [],
  totalCount: 0,
  currentPage: 1,
  itemsPerPage: 7,
};

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransaction: (state, action: PayloadAction<any[]>) => {
      state.transactions = action.payload;
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

export const {
  setTransaction,
  setTotalCount,
  setCurrentPage,
  setItemsPerPage,
} = transactionSlice.actions;

export default transactionSlice.reducer;
