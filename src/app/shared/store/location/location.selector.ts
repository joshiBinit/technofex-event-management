import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LocationState } from './location.reducer';

export const selectLocationState =
  createFeatureSelector<LocationState>('locations');

export const selectAllLocations = createSelector(
  selectLocationState,
  (state) => state.locations
);

export const selectLocationsLoading = createSelector(
  selectLocationState,
  (state) => state.loading
);
