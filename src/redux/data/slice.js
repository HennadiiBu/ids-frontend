import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './operations';

const dataSlice = createSlice({
  name: 'data',
  initialState: { items: [], status: 'idle', error: null, isLoading: false },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const dataReducer = dataSlice.reducer;
