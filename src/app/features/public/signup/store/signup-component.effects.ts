import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth-service';
import * as SignupActions from './signup-component.actions';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap(action =>
  this.authService.signup({ username: action.username, email: action.email, password: action.password }).pipe(
    map(response => SignupActions.signupSuccess({ user: response.user, token: response.token })),
    catchError(error => of(SignupActions.signupFailure({ error })))
  )
)
    )
  );
}
