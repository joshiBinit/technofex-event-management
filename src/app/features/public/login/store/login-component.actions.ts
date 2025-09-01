import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login] Login',
  props<{ username: string; password: string; role: 'user' | 'admin' }>()
);

export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{ token: string; role: string }>()
);

export const loginFailure = createAction(
  '[Login] Login Failure',
  props<{ error: string }>()
);
