import { createSlice } from '@reduxjs/toolkit';
import { logOut, signIn, signup } from './operations';

const initialState = {
  user: {
    _id: null,
    email: null,
  },
  isAuthenticated: false,
  token: '',
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state) => {
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;

        state.isLoading = false;
      })
      .addCase(signIn.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(logOut.fulfilled, (state) => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
        state.isRefreshing = true;
        state.isLoading = false;
      })
      .addCase(logOut.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {  logIn } = authSlice.actions;

export const authReducer = authSlice.reducer;
