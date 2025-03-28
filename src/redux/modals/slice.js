import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {
    signUp: { isOpen: false },
    signIn: { isOpen: false },
    zoomIn: { isOpen: false },
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
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modalName) => {
        state.modals[modalName].isOpen = false;
      });
    },
  },
});

export const { openModal, closeModal, closeAllModals } = modalsSlice.actions;
export const modalReducer = modalsSlice.reducer;
