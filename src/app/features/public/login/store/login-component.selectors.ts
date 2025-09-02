import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LoginState } from './login-component.reducer';

export const selectLoginState = createFeatureSelector<LoginState>('login');

export const selectLoginError = createSelector(
  selectLoginState,
  (state) => state.error
);
export const selectLoginLoading = createSelector(
  selectLoginState,
  (state) => state.loading
);
export const selectLoginRole = createSelector(
  selectLoginState,
  (state) => state.role
);

export const selectLoginUsername = createSelector(
  selectLoginState,
  (state) => state.username
);

export const selectLoginEmail = createSelector(
  selectLoginState,
  (state) => state.email
);
