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
      mergeMap((action) => {
        // Use the AuthService to handle login
        const loginSuccess = this.authService.login({
          username: action.username,
          password: action.password,
          role: action.role,
        });

        if (loginSuccess) {
          // Get auth data from localStorage
          const authData = JSON.parse(localStorage.getItem('authData') || '{}');
          const token = authData.token;
          const role = authData.role;

          console.log('Login successful:', authData);

          // 🔹 Navigate based on role
          if (role === 'admin') {
            this.router.navigate(['/admindashboard']);
          } else {
            this.router.navigate(['/event']);
          }

          return of(
            LoginActions.loginSuccess({
              token,
              role,
              username: action.username,
            })
          );
        } else {
          // 🔹 Check if username exists but password is wrong
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userExists = users.some(
            (u: { username: string }) => u.username === action.username
          );
          const errorMsg = userExists
            ? 'Invalid credentials'
            : 'User not found';
          console.log('Login failed:', action.username, errorMsg);

          return of(LoginActions.loginFailure({ error: errorMsg }));
        }
      })
    )
  );
}
