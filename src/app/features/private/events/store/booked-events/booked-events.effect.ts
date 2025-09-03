import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventBookingService } from '../../../../../core/services/event-booking/event-booking-service';
import * as BookedEventsActions from './booked-events.action';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
@Injectable()
export class BookedEventsEffects {
  actions$ = inject(Actions);
  bookingService = inject(EventBookingService);

  loadBookedEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookedEventsActions.loadBookedEvents),
      mergeMap(() =>
        this.bookingService.getBookedEvents().pipe(
          map((events) =>
            BookedEventsActions.loadBookedEventsSuccess({ events })
          ),
          catchError((error) =>
            of(
              BookedEventsActions.loadBookedEventsFailure({
                error: 'Failed to load Booked Events',
              })
            )
          )
        )
      )
    )
  );

  bookEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookedEventsActions.bookEvent),
      mergeMap(({ event }) =>
        this.bookingService.bookEvent(event).pipe(
          tap((events) => console.log('Used add this event', events)),
          map((savedEvent) =>
            BookedEventsActions.bookEventSuccess({ event: savedEvent })
          ),
          catchError((error) =>
            of(BookedEventsActions.bookEventFailure({ error }))
          )
        )
      )
    )
  );
}
