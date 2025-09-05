import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { selectUser } from '../../../features/public/login/store/login-component.selectors';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | undefined> = of(undefined);

  private store = inject(Store<{ login: LoginState }>);

  constructor() {
    // // TODO
    // this.user$ = of({
    //   username: 'Guest',
    //   email: 'guest@example.com',
    //   role: 'user',
    //   password: '',
    //   bookings: [],
    // });
  }

  ngOnInit(): void {
    // TODO: Check modified logic
    this.user$ = this.store.select(selectUser).pipe(
      map(({ username, email, role }) => ({
        username: username ?? 'Guest',
        email: email ?? 'guest@example.com',
        role: (role as 'user' | 'admin') ?? 'user',
        password: '*****',
        bookings: [],
      }))
    );
  }
}
