export const selectUser = (state) => state.auth.user;

export const selectIsLoading = (state) => state.auth.isLoading;

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export const selectToken = (state) => state.auth.token;
