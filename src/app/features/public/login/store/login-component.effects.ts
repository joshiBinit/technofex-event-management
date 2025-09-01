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
        return this.authService
          .login({
            username: action.username,
            password: action.password,
            role: action.role,
          })
          .pipe(
            mergeMap((loginSuccess) => {
              if (loginSuccess) {
                // ✅ Get auth data stored in localStorage by AuthService
                const authData = JSON.parse(
                  localStorage.getItem('authData') || '{}'
                );
                const token = authData.token;
                const role = authData.role;
                const username = authData.username;

                console.log('Login successful:', authData);

                // ✅ Navigate based on role
                if (role === 'admin') {
                  this.router.navigate(['/admindashboard']);
                } else {
                  this.router.navigate(['/admindashboard']);
                }

                return of(
                  LoginActions.loginSuccess({
                    token,
                    role,
                    username,
                  })
                );
              } else {
                // ❌ Invalid credentials or user not found
                return this.authService.getUsers().pipe(
                  mergeMap((users) => {
                    const userExists = users.some(
                      (u: { username: string; email?: string }) =>
                        u.username === action.username ||
                        (u.email && u.email === action.username)
                    );
                    const errorMsg = userExists
                      ? 'Invalid credentials'
                      : 'User not found';

                    console.log('Login failed:', action.username, errorMsg);

                    return of(LoginActions.loginFailure({ error: errorMsg }));
                  })
                );
              }
            })
          );
      })
    )
  );
}
