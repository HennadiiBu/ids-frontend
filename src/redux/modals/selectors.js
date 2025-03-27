export const selectSignInModal = (state) =>
  state.modals?.signIn?.isOpen || false;
export const selectSignUpModal = (state) =>
  state.modals?.signUp?.isOpen || false;
