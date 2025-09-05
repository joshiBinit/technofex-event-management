import { createReducer, on } from '@ngrx/store';
import { Location } from '../../model/event.model';
import {
  loadLocationsFailure,
  loadLocations,
  loadLocationsSuccess,
} from './location.action';
export interface LocationState {
  locations: Location[];
  loading: boolean;
}

export const initialLocationState: LocationState = {
  locations: [],
  loading: false,
};
export const locationReducer = createReducer(
  initialLocationState,
  on(loadLocations, (state) => ({
    ...state,
    loading: true,
  })),
  on(loadLocationsSuccess, (state, { locations }) => ({
    ...state,
    locations,
    loading: false,
  })),
  on(loadLocationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
  }))
);
