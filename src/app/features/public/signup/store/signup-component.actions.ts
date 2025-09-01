import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Signup Component] Signup',
  props<{ username: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Signup API] Signup Success',
  props<{ user: any; token: string; email: string; password: string }>()
);

export const signupFailure = createAction(
  '[Signup API] Signup Failure',
  props<{ error: any }>()
);
