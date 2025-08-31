import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Signup] Signup',
  props<{ username: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Signup] Signup Success',
  props<{ user: any; token: string }>()
);

export const signupFailure = createAction(
  '[Signup] Signup Failure',
  props<{ error: any }>()
);
