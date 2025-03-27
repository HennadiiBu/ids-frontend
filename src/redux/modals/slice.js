import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {
    signUp: { isOpen: false },
    signIn: { isOpen: false },
  },
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,

  reducers: {
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;

      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = false;
      }
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;
export const modalReducer = modalsSlice.reducer;
