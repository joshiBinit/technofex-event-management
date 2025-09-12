import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '../../../../../core/services/event/event-service';
import * as EventsActions from './event.action';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar-service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ROUTE_PATHS } from '../../../../../core/constants/routes.constant';

@Injectable()
export class EventsEffects {
  private store = inject(Store);
  actions$ = inject(Actions);
  eventService = inject(EventService);
  snackbarService = inject(SnackbarService);
  router = inject(Router);

  private readonly EVENT = ROUTE_PATHS.EVENT;
  private readonly LIST = ROUTE_PATHS.LIST;
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

  updateEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.updateEventSuccess),
        tap(() => {
          this.snackbarService.show('✅ Event updated successfully', 'success');
          this.router.navigate([`/${this.EVENT}/${this.LIST}`]);
        })
      ),
    { dispatch: false }
  );

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

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.deleteEvent),
      mergeMap(({ eventId }) =>
        this.eventService.deleteEvent(eventId).pipe(
          map(() => EventsActions.deleteEventSuccess({ eventId })),
          catchError((error) =>
            of(
              EventsActions.deleteEventFailure({
                error: error.message || 'Failed to delete event',
              })
            )
          )
        )
      )
    )
  );

  deleteEventSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.deleteEventSuccess),
        tap(() => {
          this.snackbarService.show('✅ Event deleted successfully', 'success');
        }),
        tap(() => {
          this.store.dispatch(EventsActions.loadEvents());
        })
      ),
    { dispatch: false }
  );

  deleteEventFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventsActions.deleteEventFailure),
        tap(({ error }) => {
          this.snackbarService.show(
            `❌ Failed to delete event: ${error}`,
            'error'
          );
        })
      ),
    { dispatch: false }
  );
}
