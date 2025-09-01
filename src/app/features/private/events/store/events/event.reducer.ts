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
  }))
);
