import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user-detail.action';
import { User } from '../../../../../shared/model/user.model';

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialUsersState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
