import { createAction, props } from '@ngrx/store';
import { Event } from '../../../../../shared/model/event.model';

export const loadEvents = createAction('[Events] Load Events');
export const loadEventsSuccess = createAction(
  '[Events] Load Events Success',
  props<{ events: Event[] }>()
);
export const loadEventsFailure = createAction(
  '[Events] Load Events Failure',
  props<{ error: string }>()
);

//Update Event
export const updateEvent = createAction(
  '[Events] Update Event',
  props<{ event: Event }>()
);

export const updateEventSuccess = createAction(
  '[Events] Update Event Success',
  props<{ event: Event }>()
);

export const updateEventFailure = createAction(
  '[Events] Update Event Failure',
  props<{ error: string }>()
);

// Delete Event
export const deleteEvent = createAction(
  '[Events] Delete Event',
  props<{ eventId: string }>()
);

export const deleteEventSuccess = createAction(
  '[Events] Delete Event Success',
  props<{ eventId: string }>()
);

export const deleteEventFailure = createAction(
  '[Events] Delete Event Failure',
  props<{ error: string }>()
);
