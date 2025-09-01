import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SignupActions from './signup-component.actions';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap(action => {
        try {
          return this.authService.signup({
            username: action.username,
            email: action.email,
            password: action.password,
            role: 'user'
          }).pipe(
            map(response => {
              // Navigate to login page after successful signup
              this.router.navigate(['/login']);
              return SignupActions.signupSuccess({
                user: response.user,
                token: response.token,
                email: action.email,
                password: action.password
              });
            }),
            catchError(error => {
              console.error('Signup error:', error);
              return of(SignupActions.signupFailure({ error: error.message || 'Username already exists' }));
            })
          );
        } catch (error: any) {
          console.error('Signup error:', error);
          return of(SignupActions.signupFailure({ error: error.message || 'Username already exists' }));
        }
      })
    )
  );
}
