import { createAction, props } from '@ngrx/store';

// Load events
export const loadEvents = createAction('[Dashboard] Load Events');

// Success action
export const loadEventsSuccess = createAction(
  '[Dashboard] Load Events Success',
  props<{ events: Event[] }>()
);
