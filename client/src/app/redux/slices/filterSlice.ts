import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  searchTerm: string;
}

const initialState: FilterState = {
  searchTerm: "",
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof FilterState; value: string }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm, setFilter } = filterSlice.actions;
export default filterSlice.reducer;
