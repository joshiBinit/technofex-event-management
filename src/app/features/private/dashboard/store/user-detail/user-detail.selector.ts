import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './user-detail.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectUserLoading = createSelector(
  selectUsersState,
  (state) => state.isLoading
);

export const selectUserError = createSelector(
  selectUsersState,
  (state) => state.error
);

export const selectNormalUsers = createSelector(selectAllUsers, (users) =>
  users.filter((user) => user.role === 'user')
);
