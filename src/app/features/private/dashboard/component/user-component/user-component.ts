import { Component } from '@angular/core';
import * as UserSelectors from '../../store/user-detail/user-detail.selector';
import * as UserActions from '../../store/user-detail/user-detail.action';
import { Store } from '@ngrx/store';
import { userListColumn } from '../../utils/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-component',
  standalone: false,
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.scss'],
})
export class UserComponent {
  displayedColumns: string[] = userListColumn;
  users$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.users$ = this.store.select(UserSelectors.selectNormalUsers);
    this.isLoading$ = this.store.select(UserSelectors.selectUserLoading);

    this.store.dispatch(UserActions.loadUsers());
  }
}
