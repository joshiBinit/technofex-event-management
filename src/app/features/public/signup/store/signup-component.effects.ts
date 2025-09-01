import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth-service';
import * as SignupActions from './signup-component.actions';
import { Router } from '@angular/router';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap((action) =>
        this.authService
          .signup({
            username: action.username,
            email: action.email,
            password: action.password,
            role: 'user', // Default role is user
          })
          .pipe(
            map((response) =>
              SignupActions.signupSuccess({
                user: response.user, // Use the user from the response which includes the role
                token: response.token,
              })
            ),
            tap(() => {
              // Navigate to login page after successful signup
              console.log('Signup successful, redirecting to login page');
              this.router.navigate(['/login']);
            }),
            catchError((error) => of(SignupActions.signupFailure({ error })))
          )
      )
    )
  );
}
