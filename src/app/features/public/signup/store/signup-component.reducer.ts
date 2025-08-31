import { createReducer, on } from '@ngrx/store';
import * as SignupActions from './signup-component.actions';

export interface SignupState {
  loading: boolean;
  error: string | null;
  user: any | null;
  token: string | null;
}

export const initialState: SignupState = {
  loading: false,
  error: null,
  user: null,
  token: null,
};

export const signupReducer = createReducer(
  initialState,
  on(SignupActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SignupActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    loading: false,
    user,
    token
  })),
  on(SignupActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
