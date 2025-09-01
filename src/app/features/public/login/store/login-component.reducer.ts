import { createReducer, on } from '@ngrx/store';
import * as LoginActions from './login-component.actions';

export interface LoginState {
  token: string | null;
  role: string | null;
  error: string | null;
  loading: boolean;
}

export const initialState: LoginState = {
  token: null,
  role: null,
  error: null,
  loading: false,
};

export const loginReducer = createReducer(
  initialState,
  on(LoginActions.login, state => ({ ...state, loading: true, error: null })),
  on(LoginActions.loginSuccess, (state, { token, role }) => ({
    ...state,
    token,
    role,
    error: null,
    loading: false,
  })),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
