import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SignupActions from './signup-component.actions';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';
import { SnackbarService } from './../../../../shared/services/snackbar/snackbar-service';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap((action) => {
        try {
          return this.authService
            .signup({
              username: action.username,
              email: action.email,
              password: action.password,
              role: 'user',
            })
            .pipe(
              map((response) => {
                this.authService.logout();
                this.router.navigate(['/login']);
                return SignupActions.signupSuccess({
                  user: response.user,
                  token: response.token,
                  email: action.email,
                  password: action.password,
                });
              }),
              catchError((error) => {
                console.error('Signup error:', error);
                return of(
                  SignupActions.signupFailure({
                    error: error.message || 'Username already exists',
                  })
                );
              })
            );
        } catch (error: any) {
          console.error('Signup error:', error);
          return of(
            SignupActions.signupFailure({
              error: error.message || 'Username already exists',
            })
          );
        }
      })
    )
  );
  signupSuccessSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignupActions.signupSuccess),
        tap(() => {
          this.snackbarService.show(
            '✅ Signup Successful! Please login.',
            'success'
          );
        })
      ),
    { dispatch: false }
  );

  signupFailureSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SignupActions.signupFailure),
        tap((action) => {
          this.snackbarService.show(
            `❌ Signup Failed: ${action.error}`,
            'error'
          );
        })
      ),
    { dispatch: false }
  );
}
