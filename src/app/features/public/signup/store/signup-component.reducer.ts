import { createReducer, on } from '@ngrx/store';
import * as SignupActions from './signup-component.actions';

export interface SignupState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: any | null;
}

export const initialState: SignupState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const signupReducer = createReducer(
  initialState,
  on(SignupActions.signup, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SignupActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),
  on(SignupActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
