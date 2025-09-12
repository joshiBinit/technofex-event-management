import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, of, map, catchError, tap } from 'rxjs';
import * as LoginActions from './login-component.actions';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROUTE_PATHS } from '../../../../core/constants/routes.constant';
import { admin } from '../../../private/events/types/user.types';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar-service';

const { ADMIN, EVENT, LIST, LOGIN, SIGNUP, DASHBOARD, USER } = ROUTE_PATHS;
@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

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
                  returnUrl !== LOGIN &&
                  returnUrl !== SIGNUP
                ) {
                  this.router.navigateByUrl(returnUrl);
                } else {
                  if (user.role === admin) {
                    this.router.navigate([EVENT, LIST]);
                  } else {
                    this.router.navigate([USER, DASHBOARD]);
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
          this.snackbarService.show('✅ Login Successful!', 'success');
        })
      ),
    { dispatch: false }
  );

  loginFailureSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginFailure),
        tap((action) => {
          this.snackbarService.show(
            `❌ Login Failed: ${action.error}`,
            'error'
          );
        })
      ),
    { dispatch: false }
  );
}
