import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardEventState } from './dashboard-event.reducer';

export const selectDashboardEventState =
  createFeatureSelector<DashboardEventState>('dashboardEvents');

export const selectDashboardEvents = createSelector(
  selectDashboardEventState,
  (state) => state.events
);

export const selectDashboardEventLoading = createSelector(
  selectDashboardEventState,
  (state) => state.isLoading
);

export const selectDashboardEventError = createSelector(
  selectDashboardEventState,
  (state) => state.error
);
