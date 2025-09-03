import { createReducer, on } from '@ngrx/store';
import * as BookedEventsActions from './booked-events.action';
import { Event } from '../../../../../shared/model/event.model';
export interface BookedEventsState {
  bookedEvents: Event[];
  loading: boolean;
  error: string | null;
}
export const initialBookedEventsState: BookedEventsState = {
  bookedEvents: [],
  loading: false,
  error: null,
};

export const bookedEventsReducer = createReducer(
  initialBookedEventsState,
  on(BookedEventsActions.cancelBooking, (state, { eventId }) => ({
    ...state,
    bookedEvents: state.bookedEvents.filter((e) => e.id !== eventId),
  })),
  on(BookedEventsActions.bookEvent, (state) => ({ ...state, loading: true })),
  on(BookedEventsActions.bookEventSuccess, (state, { event }) => ({
    ...state,
    bookedEvents: [...state.bookedEvents, event],
    loading: false,
  })),
  on(BookedEventsActions.bookEventFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(BookedEventsActions.loadBookedEvents, (state) => ({
    ...state,
    loading: true,
  })),
  on(BookedEventsActions.loadBookedEventsSuccess, (state, { events }) => ({
    ...state,
    bookedEvents: events,
    loading: false,
  })),
  on(BookedEventsActions.loadBookedEventsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
