import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, of, map, catchError } from 'rxjs';
import * as LoginActions from './login-component.actions';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      mergeMap((action) =>
        this.authService
          .login({
            username: action.username,
            password: action.password,
            role: action.role,
          })
          .pipe(
            map((user) => {
              if (user) {
                // ✅ Navigate based on role
                if (user.role === 'admin') {
                  this.router.navigate(['/admin/dashboard']);
                } else {
                  this.router.navigate(['/user/dashboard']);
                }

                return LoginActions.loginSuccess({
                  token: user.token,
                  role: user.role!,
                  username: user.username,
                  email: user.email || user.username,
                  bookings: user.bookings || [],
                });
              } else {
                return LoginActions.loginFailure({
                  error: 'Invalid credentials',
                });
              }
            }),
            catchError((error) =>
              of(LoginActions.loginFailure({ error: error.message }))
            )
          )
      )
    )
  );
}
