import { createReducer, on } from '@ngrx/store';
import * as BookingActions from './event-booking.action';
import { User } from '../../../../../shared/model/user.model';

export interface BookingState {
  user: User | null;
  error: string | null;
  successMessage: string | null;
}

export const initialState: BookingState = {
  user: null,
  error: null,
  successMessage: null,
};

export const bookingReducer = createReducer(
  initialState,

  on(BookingActions.bookEvent, (state) => ({
    ...state,
    error: null,
    successMessage: null,
  })),

  on(BookingActions.bookEventSuccess, (state, { user }) => ({
    ...state,
    user,
    successMessage: 'Event booked successfully ✅',
  })),

  on(BookingActions.bookEventFailure, (state, { error }) => ({
    ...state,
    error,
    successMessage: null,
  })),

  on(BookingActions.clearBookingMessages, (state) => ({
    ...state,
    successMessage: null,
    error: null,
  }))
);
