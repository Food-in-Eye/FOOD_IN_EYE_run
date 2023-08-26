import { createSlice } from "@reduxjs/toolkit";

export const TOKEN_TIME_OUT = 20000;

export const tokenSlice = createSlice({
  name: "authToken",
  initialState: {
    authenticated: false,
    accessToken: null,
    expireTime: null,
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      state.authenticated = true;
      state.accessToken = action.payload;
      state.createDate = action.createDate;
      //   const currentTime = new Date().getTime();
      state.expireTime = action.createDate + TOKEN_TIME_OUT;
    },
    DELETE_TOKEN: (state) => {
      state.authenticated = false;
      state.accessToken = null;
      state.expireTime = null;
    },
  },
});

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export const authToken = tokenSlice.reducer;

// export default tokenSlice.reducer;
