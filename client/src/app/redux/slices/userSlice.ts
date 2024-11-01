import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  name: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        name: string;
      }>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
