import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../shared/model/user.model';
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
export class UserComponent implements OnInit {
  displayedColumns: string[] = userListColumn;
  users$: Observable<User[]>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store) {
    this.users$ = this.store.select(UserSelectors.selectNormalUsers);
    this.isLoading$ = this.store.select(UserSelectors.selectUserLoading);
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }
}
