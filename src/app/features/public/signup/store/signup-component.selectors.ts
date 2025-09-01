import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SignupState } from './signup-component.reducer';

export const selectSignupState = createFeatureSelector<SignupState>('signup');

export const selectSignupLoading = createSelector(
  selectSignupState,
  (state) => state.loading
);

export const selectSignupError = createSelector(
  selectSignupState,
  (state) => state.error
);

export const selectSignupUser = createSelector(
  selectSignupState,
  (state) => state.user
);

export const selectSignupToken = createSelector(
  selectSignupState,
  (state) => state.token
);
