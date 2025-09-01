// src/app/store/events/events.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState } from './event.reducer';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectAllEvents = createSelector(
  selectEventsState,
  (state) => state.events
);

export const selectEventLoading = createSelector(
  selectEventsState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectEventsState,
  (state) => state.error
);

// Example: filter by category
export const selectEventsByCategory = (category: string) =>
  createSelector(selectAllEvents, (events) =>
    events.filter((event) => event.category === category)
  );
