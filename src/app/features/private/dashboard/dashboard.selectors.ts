import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventState } from './dashboard.state';

export const selectEventState = createFeatureSelector<EventState>('events');

export const selectAllEvents = createSelector(
  selectEventState,
  (state) => state.events
);
export const selectTotalUsers = createSelector(
  selectEventState,
  (state) => state.users
);
export const selectTotalBookings = createSelector(selectEventState, (state) =>
  state.events.reduce(
    (total: number, e: { bookings: number }) => total + e.bookings,
    0
  )
);
