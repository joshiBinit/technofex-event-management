import { createAction, props } from '@ngrx/store';
import { Event } from '../../../../../shared/model/event.model';

export const bookEvent = createAction(
  '[BookedEvents] Book Event',
  props<{ event: Event }>()
);

export const bookEventSuccess = createAction(
  '[BookedEvents] Book Event Success',
  props<{ event: Event }>()
);

export const bookEventFailure = createAction(
  '[BookedEvents] Book Event Failure',
  props<{ error: any }>()
);

export const loadBookedEvents = createAction(
  '[BookedEvents] Load Booked Events'
);
export const loadBookedEventsSuccess = createAction(
  '[BookedEvents] Load BookedEvents Success',
  props<{ events: Event[] }>()
);

export const loadBookedEventsFailure = createAction(
  '[BookedEvents] Load BookedEvents Failure',
  props<{ error: any }>()
);
