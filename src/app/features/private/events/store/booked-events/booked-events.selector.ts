import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookedEventsState } from './booked-events.reducer';

export const selectBookedEventsState =
  createFeatureSelector<BookedEventsState>('bookedEvents');

export const selectBookedEvents = createSelector(
  selectBookedEventsState,
  (state) => state.bookedEvents
);
export const selectBookedEventsLoading = createSelector(
  selectBookedEventsState,
  (state) => state.loading
);
