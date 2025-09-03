import { createReducer, on } from '@ngrx/store';
import * as DashboardEventActions from './dashboard-event.action';
import { Event } from '../../../../../shared/model/event.model';

export interface DashboardEventState {
  events: Event[];
  isLoading: boolean;
  error: any;
}

export const initialState: DashboardEventState = {
  events: [],
  isLoading: false,
  error: null,
};

export const dashboardEventReducer = createReducer(
  initialState,

  // Add event
  on(DashboardEventActions.addEvent, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(DashboardEventActions.addEventSuccess, (state, { event }) => ({
    ...state,
    events: [...state.events, event],
    isLoading: false,
    error: null,
  })),
  on(DashboardEventActions.addEventFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
