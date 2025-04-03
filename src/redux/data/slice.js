import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './operations';

const dataSlice = createSlice({
  name: 'data',
  initialState: { items: [], status: 'idle', error: null, isLoading: false },
  reducers: {
    setData: (state, action) => {
      state.items = Object.entries(action.payload).map(
        ([visitDate, ttNumbers]) => ({
          visitDate,
          ttNumbers,
        })
      );
    },
    updateData: (state, action) => {
      const { visitDate, ttNumbers } = action.payload;
      const item = state.items.find((item) => item.visitDate === visitDate);
      if (!item) return;

      for (const [key, ttArray] of Object.entries(ttNumbers)) {
        if (!item.ttNumbers[key]) {
          item.ttNumbers[key] = []; // Создаем массив, если его нет
        }

        item.ttNumbers[key] = item.ttNumbers[key].map((tt, index) => ({
          ...tt,
          verified: true,
          verifiedResult: ttArray[index]?.verifiedResult ?? 'ок', // Берем значение из action.payload
        }));
      }
    },
  },

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

export const { setData, updateData } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;
