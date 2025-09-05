import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '../../../core/services/event/event-service';
import { HttpClient } from '@angular/common/http';
import {
  loadLocations,
  loadLocationsFailure,
  loadLocationsSuccess,
} from './location.action';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class locationsEffect {
  actions$ = inject(Actions);
  eventService = inject(EventService);
  http = inject(HttpClient);

  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocations),
      mergeMap(() =>
        this.eventService.loadLocations().pipe(
          map((locations) => loadLocationsSuccess({ locations })),
          catchError((error) => of(loadLocationsFailure({ error })))
        )
      )
    )
  );
}
