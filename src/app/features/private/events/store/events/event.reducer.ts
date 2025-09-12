import { createReducer, on } from '@ngrx/store';
import * as EventsActions from './event.action';
import { Event } from '../../../../../shared/model/event.model';
export interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}
export const initialEventsState: EventsState = {
  events: [],
  isLoading: false,
  error: null,
};

export const eventsReducer = createReducer(
  initialEventsState,
  on(EventsActions.loadEvents, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(EventsActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    isLoading: false,
  })),
  on(EventsActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(EventsActions.updateEvent, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(EventsActions.updateEventSuccess, (state, { event }) => ({
    ...state,
    isLoading: false,
    events: state.events.map((e) => (e.id === event.id ? event : e)),
  })),
  on(EventsActions.updateEventFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(EventsActions.deleteEvent, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(EventsActions.deleteEventSuccess, (state, { eventId }) => ({
    ...state,
    isLoading: false,
    events: state.events.filter((event) => event.id !== eventId),
  })),

  on(EventsActions.deleteEventFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
