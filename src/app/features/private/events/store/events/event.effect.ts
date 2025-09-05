import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '../../../../../core/services/event/event-service';
import * as EventsActions from './event.action';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar-service';
import { Router } from '@angular/router';

@Injectable()
export class EventsEffects {
  actions$ = inject(Actions);
  eventService = inject(EventService);
  snackbarService = inject(SnackbarService);
  router = inject(Router);

  // Load events
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

  // Update event with snackbar notifications
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

  // Show snackbar on success
  updateEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.updateEventSuccess),
        tap(() => {
          this.snackbarService.show('✅ Event updated successfully', 'success');
          this.router.navigate(['/event/list']);
        })
      ),
    { dispatch: false } // No further action dispatched
  );

  // Show snackbar on failure
  updateEventFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.updateEventFailure),
        tap(({ error }) => {
          this.snackbarService.show(
            `❌ Failed to update event: ${error}`,
            'error'
          );
        })
      ),
    { dispatch: false }
  );
}
