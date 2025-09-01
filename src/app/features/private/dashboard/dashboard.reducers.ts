import { createReducer, on } from '@ngrx/store';
import { initialEventState, EventState } from './dashboard.state';
import * as DashboardActions from './dashboard.actions';

// Export reducer
export const eventReducer = createReducer(
  initialEventState,
  on(DashboardActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events: events,
  }))
);
