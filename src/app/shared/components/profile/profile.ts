import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, map, Observable, of } from 'rxjs';
import { User } from '../../model/user.model';
import { Store } from '@ngrx/store';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import {
  selectLoginEmail,
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
    this.user$ = of({
      username: 'Guest',
      email: 'guest@example.com',
      role: 'user',
      password: '',
      bookings: [],
    });
  }

  ngOnInit(): void {
    this.user$ = combineLatest([
      this.store.select(selectLoginUsername),
      this.store.select(selectLoginEmail),
      this.store.select(selectLoginRole),
    ]).pipe(
      map(([username, email, role]) => ({
        username: username ?? 'Guest',
        email: email ?? 'guest@example.com',
        role: (role as 'user' | 'admin') ?? 'user',
        password: '*****',
        bookings: [],
      }))
    );
  }
}
