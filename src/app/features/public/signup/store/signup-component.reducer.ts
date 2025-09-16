import { createReducer, on } from '@ngrx/store';
import * as SignupActions from './signup-component.actions';
import { UserInterface } from '@event-management/event-library';
export interface SignupState {
  user: UserInterface[];
  token: string | null;
  loading: boolean;
  error: any | null;
}

export const initialState: SignupState = {
  user: [],
  token: null,
  loading: false,
  error: null,
};

export const signupReducer = createReducer(
  initialState,
  on(SignupActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SignupActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
  })),
  on(SignupActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
