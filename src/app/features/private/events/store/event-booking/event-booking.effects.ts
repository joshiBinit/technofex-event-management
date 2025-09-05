import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../../../core/services/auth-service';
import * as BookingActions from './event-booking.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as EventsActions from '../../store/events/event.action';
import { mapBookingResult } from '../util/event-booking-utils';

@Injectable()
export class EventBookingEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  constructor() {}

  bookEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.bookEvent),
      mergeMap(({ event }) =>
        this.authService.addBooking(event).pipe(
          map((result) => mapBookingResult(result, event)),
          catchError(() =>
            of(
              BookingActions.bookEventFailure({
                error: `Unexpected error while booking ${event.title}`,
              })
            )
          )
        )
      )
    )
  );
  loadEventsAfterBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.bookEventSuccess),
      map(() => EventsActions.loadEvents())
    )
  );
}
