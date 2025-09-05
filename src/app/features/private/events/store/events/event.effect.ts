import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '../../../../../core/services/event/event-service';
import * as EventsActions from './event.action';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class EventsEffects {
  actions$ = inject(Actions);
  eventService = inject(EventService);

  // Existing load
  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvents),
      mergeMap(() =>
        this.eventService.getEvents().pipe(
          map((events) => EventsActions.loadEventsSuccess({ events })),
          catchError((error) => of(EventsActions.loadEventsFailure({ error })))
        )
      )
    )
  );

  // ✅ New update effect
  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.updateEvent),
      mergeMap(({ event }) => {
        if (!event.id) {
          return of(
            EventsActions.updateEventFailure({ error: 'Event ID is missing' })
          );
        }

        return this.eventService.updateEvent(event.id, event).pipe(
          map(() => EventsActions.updateEventSuccess({ event })),
          catchError((error) => of(EventsActions.updateEventFailure({ error })))
        );
      })
    )
  );
}
