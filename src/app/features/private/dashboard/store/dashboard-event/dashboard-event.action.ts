import { createAction, props } from '@ngrx/store';
import { Event } from '../../../../../shared/model/event.model';

export const addEvent = createAction(
  '[Dashboard] Add Event',
  props<{ event: Event }>()
);

export const addEventSuccess = createAction(
  '[Dashboard] Add Event Success',
  props<{ event: Event }>()
);

export const addEventFailure = createAction(
  '[Dashboard] Add Event Failure',
  props<{ error: any }>()
);
