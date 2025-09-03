// src/app/store/events/events.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '../../../../../core/services/event/event-service';
import * as EventsActions from './event.action';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class EventsEffects {
  
  actions$ = inject(Actions);
  eventService = inject(EventService);
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



}
