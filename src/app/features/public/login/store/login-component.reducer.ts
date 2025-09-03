import { createReducer, on } from '@ngrx/store';
import * as LoginActions from './login-component.actions';
import { Event } from '../../../../shared/model/event.model';

export interface LoginState {
  token: string | null;
  role: string | null;
  username: string | null;
  email: string | null;
  bookings: Event[]; // ✅ store user bookings here
  error: string | null;
  loading: boolean;
}

export const initialState: LoginState = {
  token: null,
  role: null,
  username: null,
  email: null,
  bookings: [],
  error: null,
  loading: false,
};

export const loginReducer = createReducer(
  initialState,
  on(LoginActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(
    LoginActions.loginSuccess,
    (state, { token, role, username, email, bookings }) => ({
      ...state,
      token,
      role,
      username,
      email,
      bookings,
      error: null,
      loading: false,
    })
  ),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(
    LoginActions.initializeLogin,
    (state, { token, role, username, email, bookings }) => ({
      ...state,
      token,
      role,
      username,
      email,
      bookings,
      error: null,
      loading: false,
    })
  )
);
