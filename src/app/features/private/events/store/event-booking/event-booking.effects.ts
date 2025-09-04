import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../../../core/services/auth-service';
import * as BookingActions from './event-booking.action';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class EventBookingEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  constructor() {}

  bookEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.bookEvent),
      mergeMap(({ event }) => {
        console.log('Effect triggered for booking event:', event);
        return this.authService.addBooking(event).pipe(
          map((result) => {
            console.log('Booking result:', result);
            if (result === 'duplicate') {
              return BookingActions.bookEventFailure({
                error: `${event.title} is already booked ❌`,
              });
            } else if (result === 'soldout') {
              return BookingActions.bookEventFailure({
                error: `${event.title} is sold out ❌`,
              });
            } else if (!result) {
              return BookingActions.bookEventFailure({
                error: `Failed to book ${event.title}`,
              });
            }
            return BookingActions.bookEventSuccess({ user: result });
          }),
          catchError((err) => {
            console.error('Booking effect error:', err);
            return of(
              BookingActions.bookEventFailure({
                error: `Unexpected error while booking ${event.title}`,
              })
            );
          })
        );
      })
    )
  );
}
