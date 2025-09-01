import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../model/user.model';
import { Store } from '@ngrx/store';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import {
  selectLoginRole,
  selectLoginUsername,
} from '../../../features/public/login/store/login-component.selectors';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;

  private store = inject(Store<{ login: LoginState }>);

  constructor() {
    // Default user object if not logged in
    this.user$ = of({
      username: 'Guest',
      email: 'guest@example.com',
      role: 'user',
      password: '',
    });
  }

  ngOnInit(): void {
    // Get logged-in username and role from store
    this.store.select(selectLoginUsername).subscribe((username) => {
      this.store.select(selectLoginRole).subscribe((role) => {
        if (username) {
          this.user$ = of({
            username,
            email: `${username}@example.com`,
            role: role as 'user' | 'admin',
            password: '*****',
          });
        }
      });
    });
  }
}
