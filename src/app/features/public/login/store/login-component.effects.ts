import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, of } from 'rxjs';
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
      mergeMap(action => {
        const success = this.authService.login({
          username: action.username,
          password: action.password,
          role: action.role
        });

        if (success) {
          const authData = JSON.parse(localStorage.getItem('authData')!);
          if (authData.role === 'admin') this.router.navigate(['/admin-dashboard']);
          else this.router.navigate(['/event']);

          return of(LoginActions.loginSuccess({ token: authData.token, role: authData.role }));
        } else {
          return of(LoginActions.loginFailure({ error: 'Invalid credentials' }));
        }
      })
    )
  );
}
