import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HoldingState {
  holdings: any[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  totalGains: number;
  totalLosses: number;
}

const initialState: HoldingState = {
  holdings: [],
  totalCount: 0,
  currentPage: 1,
  itemsPerPage: 8,
  totalGains: 0,
  totalLosses: 0,
};

export const holdingSlice = createSlice({
  name: "holdings",
  initialState,
  reducers: {
    setHoldings(state, action: PayloadAction<any[]>) {
      state.holdings = action.payload;
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
    setTotalGainsLosses: (
      state,
      action: PayloadAction<{ totalGains: number; totalLosses: number }>
    ) => {
      state.totalGains = action.payload.totalGains;
      state.totalLosses = action.payload.totalLosses;
    },
  },
});

export const {
  setHoldings,
  setTotalCount,
  setCurrentPage,
  setItemsPerPage,
  setTotalGainsLosses,
} = holdingSlice.actions;

export default holdingSlice.reducer;
