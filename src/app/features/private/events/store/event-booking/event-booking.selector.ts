import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from './event-booking.reducer';

export const selectBookingState =
  createFeatureSelector<BookingState>('booking');

export const selectBookingUser = createSelector(
  selectBookingState,
  (state) => state?.user ?? null
);
export const selectBookedEventsByUser = createSelector(
  selectBookingState,
  (state) => state.user?.bookings ?? []
);

export const selectBookingError = createSelector(
  selectBookingState,
  (state) => state?.error ?? null
);

export const selectBookingSuccessMessage = createSelector(
  selectBookingState,
  (state) => state?.successMessage ?? null
);
