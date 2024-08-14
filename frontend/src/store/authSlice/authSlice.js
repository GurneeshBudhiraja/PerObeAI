import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isAuth: false,
  email: null,
  uid: null,
  preferred_fashion_style: null,
  accessibility: null,
  city: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set auth state with user data after login
    setUser: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.city = action.payload.city;
      state.preferred_fashion_style = action.payload.preferred_fashion_style;
      state.accessibility = action.payload.accessibility;
      state.accessToken = action.payload.accessToken;
    },

    // Reset auth state
    logoutUser: (state) => {
      state.uid = null;
      state.email = null;
      state.isAuth = false;
      state.city = null;
      state.preferred_fashion_style = null;
      state.accessibility = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
