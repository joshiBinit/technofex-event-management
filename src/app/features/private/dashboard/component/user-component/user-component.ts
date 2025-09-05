import { Component, OnDestroy, inject } from '@angular/core';
import * as UserSelectors from '../../store/user-detail/user-detail.selector';
import * as UserActions from '../../store/user-detail/user-detail.action';
import { Store } from '@ngrx/store';
import { userListColumn } from '../../utils/types';

@Component({
  selector: 'app-user-component',
  standalone: false,
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.scss'],
})
export class UserComponent {
  private store = inject(Store);
  displayedColumns: string[] = userListColumn;
  users$ = this.store.select(UserSelectors.selectNormalUsers);
  isLoading$ = this.store.select(UserSelectors.selectUserLoading);

  constructor() {
    this.store.dispatch(UserActions.loadUsers());
  }
}
