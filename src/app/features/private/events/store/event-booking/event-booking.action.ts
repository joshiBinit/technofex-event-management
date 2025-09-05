import { createAction, props } from '@ngrx/store';
import { Event } from '../../../../../shared/model/event.model';
import { User } from '../../../../../shared/model/user.model';

export const bookEvent = createAction(
  '[Event Booking] Book Event',
  props<{ event: Event }>()
);

export const bookEventSuccess = createAction(
  '[Event Booking] Book Event Success',
  props<{ user: User }>()
);

export const bookEventFailure = createAction(
  '[Event Booking] Book Event Failure',
  props<{ error: string }>()
);

export const clearBookingMessages = createAction('[Booking] Clear Messages');
