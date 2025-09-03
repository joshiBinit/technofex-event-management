import { createAction, props } from '@ngrx/store';
import { Event } from '../../../../shared/model/event.model';

export const login = createAction(
  '[Login] Login',
  props<{ username: string; password: string; role: 'user' | 'admin'; returnUrl?: string }>()
);

export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{
    token: string;
    role: string;
    username: string;
    email: string;
    bookings: Event[];
  }>()
);

export const loginFailure = createAction(
  '[Login] Login Failure',
  props<{ error: string }>()
);

export const initializeLogin = createAction(
  '[Login] Initialize From LocalStorage',
  props<{
    token: string;
    role: string;
    username: string;
    email: string;
    bookings: Event[];
  }>()
);
