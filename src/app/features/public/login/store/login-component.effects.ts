import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, of, map, catchError, tap } from 'rxjs';
import * as LoginActions from './login-component.actions';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      mergeMap((action) =>
        this.authService
          .login({
            username: action.username,
            password: action.password,
            role: action.role,
            returnUrl: action.returnUrl,
          })
          .pipe(
            map((user) => {
              if (user) {
                const returnUrl = action.returnUrl;

                if (
                  returnUrl &&
                  returnUrl !== '/' &&
                  returnUrl !== '/login' &&
                  returnUrl !== '/signup'
                ) {
                  this.router.navigateByUrl(returnUrl);
                } else {
                  if (user.role === 'admin') {
                    this.router.navigate(['/event/list']);
                  } else {
                    this.router.navigate(['/user/dashboard']);
                  }
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

  loginSuccessSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginSuccess),
        tap(() => {
          this.snackBar.open('✅ Login Successful!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        })
      ),
    { dispatch: false }
  );

  loginFailureSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginFailure),
        tap((action) => {
          this.snackBar.open(`❌ Login Failed: ${action.error}`, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        })
      ),
    { dispatch: false }
  );
}
