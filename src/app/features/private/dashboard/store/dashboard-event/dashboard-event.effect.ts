import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EventService } from '../../../../../core/services/event/event-service';
import {
  addEvent,
  addEventSuccess,
  addEventFailure,
} from './dashboard-event.action';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';

@Injectable()
export class DashboardEventEffects {
  actions$ = inject(Actions);
  private eventService = inject(EventService);

  addEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addEvent),
      mergeMap((action) => {
        const eventWithAvailable: Event = {
          ...action.event,
          availableTickets: action.event.totalTickets,
        };

        return this.eventService.addEvent(eventWithAvailable).pipe(
          map((event) => addEventSuccess({ event })),
          catchError((error) => of(addEventFailure({ error })))
        );
      })
    )
  );
}
