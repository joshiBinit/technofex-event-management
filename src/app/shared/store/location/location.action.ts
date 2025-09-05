import { createAction, props } from '@ngrx/store';
import { Location } from '../../model/event.model';

export const loadLocations = createAction('[Location] Load Location');
export const loadLocationsSuccess = createAction(
  '[Location] Load Location Success',
  props<{ locations: Location[] }>()
);
export const loadLocationsFailure = createAction(
  '[Location] Load Location Failure',
  props<{ error: string }>()
);
