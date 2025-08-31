# Event Management System Documentation

This document provides a detailed explanation of the authentication system, including services, guards, login, and signup components.

## Table of Contents

1. [Auth Service](#auth-service)
2. [Auth Guard](#auth-guard)
3. [Login Component](#login-component)
4. [Signup Component](#signup-component)
5. [State Management](#state-management)

## Auth Service

**File: `auth-service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { User } from '../../shared/model/user.model';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
```
- Imports necessary Angular and RxJS dependencies
- `Injectable` decorator to make the service available for dependency injection
- `User` model for type safety
- `Router` for navigation after authentication actions
- `Observable` and `of` for returning reactive streams

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorageKey = 'authData';
  private usersKey = 'users'; // store registered users

  constructor(private router: Router) {}
```
- Defines the service as injectable at the root level (singleton)
- Declares private properties for localStorage keys
- Injects the Router service

```typescript
  /** LOGIN **/
  login(user: User): boolean {
    const users = this.getUsers();
    const existingUser = users.find(u => u.username === user.username && u.password === user.password);

    if (existingUser) {
      const token = this.generateToken();
      const authData = { username: existingUser.username, role: existingUser.role, token };
      localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
      return true;
    }

    return false;
  }
```
- `login` method accepts a User object and returns a boolean
- Retrieves users from localStorage
- Finds a matching user by username and password
- If found, generates a token and stores auth data in localStorage
- Returns true for successful login, false otherwise

```typescript
  /** SIGNUP **/
  signup(user: User): Observable<{ user: User; token: string }> {
    const users = this.getUsers();
    const userExists = users.some(u => u.username === user.username);

    if (userExists) {
      throw new Error('Username already exists'); // will be caught by effect
    }

    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    const token = this.generateToken();
    const authData = { username: user.username, role: user.role, token };
    localStorage.setItem(this.localStorageKey, JSON.stringify(authData));

    return of({ user, token }); // return user + token
  }
```
- `signup` method accepts a User object and returns an Observable
- Checks if username already exists
- If username exists, throws an error (to be caught by NgRx effect)
- Otherwise, adds the user to localStorage
- Generates a token and stores auth data
- Returns an Observable with user and token

```typescript
  /** LOGOUT **/
  logout() {
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/login']);
  }
```
- `logout` method removes auth data from localStorage
- Navigates to the login page

```typescript
  /** CHECK LOGIN **/
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.localStorageKey);
  }
```
- `isLoggedIn` method checks if auth data exists in localStorage
- Returns true if logged in, false otherwise

```typescript
  /** GET ROLE **/
  getRole(): 'user' | 'admin' | null {
    const authData = localStorage.getItem(this.localStorageKey);
    return authData ? JSON.parse(authData).role : null;
  }
```
- `getRole` method retrieves the user's role from localStorage
- Returns 'user', 'admin', or null

```typescript
  /** HELPER: generate token **/
  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /** HELPER: get all users **/
  private getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }
```
- `generateToken` is a private helper method that creates a unique token
- `getUsers` is a private helper method that retrieves all users from localStorage

## Auth Guard

**File: `auth-guard-guard.ts`**

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
```
- Imports necessary Angular dependencies
- `CanActivate` interface for route guard implementation

```typescript
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
```
- Defines the guard as injectable at the root level
- Implements the CanActivate interface
- Injects AuthService and Router

```typescript
  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getRole();
    if (role === 'admin') this.router.navigate(['/admin-dashboard']);
    else this.router.navigate(['/event']);

    return true;
  }
```
- `canActivate` method determines if a route can be activated
- Checks if user is logged in, redirects to login if not
- Redirects to appropriate dashboard based on user role
- Returns true if route can be activated, false otherwise

## Login Component

**File: `login-component.ts`**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as LoginActions from '../store/login-component.actions';
import { LoginState } from '../store/login-component.reducer';
import { selectLoginError, selectLoginLoading } from '../store/login-component.selectors';
```
- Imports necessary Angular, NgRx, and RxJS dependencies
- `Component` decorator for defining Angular components
- `FormBuilder` and related classes for reactive forms
- NgRx imports for state management

```typescript
@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error$!: Observable<string | null>;
  loading$!: Observable<boolean>;
  
  private fb = inject(FormBuilder);
  private store = inject(Store<{ login: LoginState }>);
```
- Component decorator with metadata
- Declares class properties for form and observables
- Uses Angular's inject function for dependency injection

```typescript
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.error$ = this.store.select(selectLoginError);
    this.loading$ = this.store.select(selectLoginLoading);
  }
```
- `ngOnInit` lifecycle hook initializes the component
- Creates a reactive form with email and password fields
- Sets up validators for form fields
- Selects error and loading states from the NgRx store

```typescript
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(LoginActions.login({ username: email, password, role: 'user' }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
```
- `onSubmit` method handles form submission
- Checks if form is valid
- If valid, dispatches login action with form values
- If invalid, marks all form controls as touched to show validation errors

**File: `login-component.html`**

```html
<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
```
- Creates a centered container for the login form
- Applies Tailwind CSS classes for styling
- Displays a heading for the login form

```html
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" formControlName="email"
          class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Enter your email" />
        <p class="text-red-500 text-xs mt-1"
          *ngIf="loginForm.controls['email'].invalid && loginForm.controls['email'].touched">
          Valid email is required
        </p>
      </div>
```
- Creates a form with formGroup directive
- Sets up email input field with validation
- Displays validation error message when email is invalid and touched

```html
      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" formControlName="password"
          class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Enter your password" />
        <p class="text-red-500 text-xs mt-1"
          *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched">
          Password must be at least 6 characters
        </p>
      </div>
```
- Sets up password input field with validation
- Displays validation error message when password is invalid and touched

```html
      <!-- Error -->
      <p class="text-red-500 text-sm" *ngIf="error$ | async as error">{{ error }}</p>
```
- Displays error message from the store if there is one

```html
      <!-- Button -->
      <button type="submit" [disabled]="loginForm.invalid || (loading$ | async)"
        class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {{ (loading$ | async) ? 'Logging in...' : 'Login' }}
      </button>
    </form>
```
- Submit button that is disabled when form is invalid or loading
- Changes button text based on loading state

```html
    <p class="mt-4 text-sm text-center text-gray-600">
      Don't have an account?
      <a routerLink="/signup" class="text-blue-600 hover:underline">Sign up</a>
    </p>
  </div>
</div>
```
- Provides a link to the signup page

## Signup Component

**File: `signup-component.ts`**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SignupState } from '../store/signup-component.reducer';
import * as SignupActions from '../store/signup-component.actions';
import { selectSignupError, selectSignupLoading } from '../store/signup-component.selectors';
```
- Imports necessary Angular, NgRx, and RxJS dependencies
- Similar to login component but with signup-specific imports

```typescript
@Component({
  selector: 'app-signup-component',
  templateUrl: './signup-component.html',
  styleUrls: ['./signup-component.scss'],
  standalone: false
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  error$!: Observable<string | null>;
  loading$!: Observable<boolean>;

  private fb = inject(FormBuilder);
  private store = inject(Store<{ signup: SignupState }>);
```
- Component decorator with metadata
- Declares class properties for form and observables
- Uses Angular's inject function for dependency injection

```typescript
  ngOnInit(): void {
    // Add 'username' control
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.error$ = this.store.select(selectSignupError);
    this.loading$ = this.store.select(selectSignupLoading);
  }
```
- `ngOnInit` lifecycle hook initializes the component
- Creates a reactive form with username, email, password, and confirmPassword fields
- Sets up validators for form fields
- Adds a custom validator for password matching
- Selects error and loading states from the NgRx store

```typescript
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }
```
- Custom validator function to check if password and confirmPassword match
- Returns null if they match, or an error object if they don't

```typescript
  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      // Dispatch signup action including username
      this.store.dispatch(SignupActions.signup({ username, email, password }));
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
```
- `onSubmit` method handles form submission
- Checks if form is valid
- If valid, dispatches signup action with form values
- If invalid, marks all form controls as touched to show validation errors

**File: `signup-component.html`**

```html
<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
```
- Creates a centered container for the signup form
- Applies Tailwind CSS classes for styling
- Displays a heading for the signup form

```html
    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <!-- Username -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Username</label>
        <input type="text" formControlName="username"
          class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Enter your username" />
        <p class="text-red-500 text-xs mt-1"
          *ngIf="signupForm.get('username')?.invalid && signupForm.get('username')?.touched">
          Username is required
        </p>
      </div>
```
- Creates a form with formGroup directive
- Sets up username input field with validation
- Displays validation error message when username is invalid and touched

```html
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" formControlName="email"
          class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Enter your email" />
        <p class="text-red-500 text-xs mt-1"
          *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched">
          Valid email is required
        </p>
      </div>
```
- Sets up email input field with validation
- Displays validation error message when email is invalid and touched

```html
      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" formControlName="password"
          class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Enter your password" />
        <p class="text-red-500 text-xs mt-1"
          *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched">
          Password must be at least 6 characters
        </p>
      </div>
```
- Sets up password input field with validation
- Displays validation error message when password is invalid and touched

```html
      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input type="password" formControlName="confirmPassword"
          class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          placeholder="Confirm your password" />
        <p class="text-red-500 text-xs mt-1"
          *ngIf="signupForm.errors?.['mismatch'] && signupForm.get('confirmPassword')?.touched">
          Passwords do not match
        </p>
      </div>
```
- Sets up confirmPassword input field with validation
- Displays validation error message when passwords don't match

```html
      <!-- Error -->
      <p class="text-red-500 text-sm" *ngIf="error$ | async as error">{{ error }}</p>
```
- Displays error message from the store if there is one

```html
      <!-- Button -->
      <button type="submit" [disabled]="signupForm.invalid || (loading$ | async)"
        class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
        {{ (loading$ | async) ? 'Signing up...' : 'Sign Up' }}
      </button>
    </form>
```
- Submit button that is disabled when form is invalid or loading
- Changes button text based on loading state

```html
    <p class="mt-4 text-sm text-center text-gray-600">
      Already have an account?
      <a routerLink="/login" class="text-blue-600 hover:underline">Login</a>
    </p>
  </div>
</div>
```
- Provides a link to the login page

## State Management

### Login State

**File: `login-component.actions.ts`**

```typescript
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login] Login',
  props<{ username: string; password: string; role: 'user' | 'admin' }>()
);

export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{ token: string; role: string }>()
);

export const loginFailure = createAction(
  '[Login] Login Failure',
  props<{ error: string }>()
);
```
- Defines NgRx actions for login flow
- `login` action with username, password, and role properties
- `loginSuccess` action with token and role properties
- `loginFailure` action with error property

**File: `login-component.reducer.ts`**

```typescript
import { createReducer, on } from '@ngrx/store';
import * as LoginActions from './login-component.actions';

export interface LoginState {
  token: string | null;
  role: string | null;
  error: string | null;
  loading: boolean;
}

export const initialState: LoginState = {
  token: null,
  role: null,
  error: null,
  loading: false,
};
```
- Defines the shape of the login state
- Sets initial values for state properties

```typescript
export const loginReducer = createReducer(
  initialState,
  on(LoginActions.login, state => ({ ...state, loading: true, error: null })),
  on(LoginActions.loginSuccess, (state, { token, role }) => ({
    ...state,
    token,
    role,
    error: null,
    loading: false,
  })),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
```
- Creates a reducer function that handles login actions
- Updates state based on action type
- Maintains immutability by creating new state objects

**File: `login-component.effects.ts`**

```typescript
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
```
- Defines NgRx effects for login flow
- Injects dependencies using Angular's inject function

```typescript
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
```
- Creates an effect that listens for login actions
- Calls the auth service's login method
- Navigates to the appropriate page based on user role
- Returns success or failure actions based on the result

### Signup State

**File: `signup-component.actions.ts`**

```typescript
import { createAction, props } from '@ngrx/store';

export const signup = createAction(
  '[Signup] Signup',
  props<{ username: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Signup] Signup Success',
  props<{ user: any; token: string }>()
);

export const signupFailure = createAction(
  '[Signup] Signup Failure',
  props<{ error: any }>()
);
```
- Defines NgRx actions for signup flow
- `signup` action with username, email, and password properties
- `signupSuccess` action with user and token properties
- `signupFailure` action with error property

**File: `signup-component.reducer.ts`**

```typescript
import { createReducer, on } from '@ngrx/store';
import * as SignupActions from './signup-component.actions';

export interface SignupState {
  loading: boolean;
  error: string | null;
  user: any | null;
  token: string | null;
}

export const initialState: SignupState = {
  loading: false,
  error: null,
  user: null,
  token: null,
};
```
- Defines the shape of the signup state
- Sets initial values for state properties

```typescript
export const signupReducer = createReducer(
  initialState,
  on(SignupActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SignupActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    loading: false,
    user,
    token
  })),
  on(SignupActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
```
- Creates a reducer function that handles signup actions
- Updates state based on action type
- Maintains immutability by creating new state objects

**File: `signup-component.effects.ts`**

```typescript
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
```
- Defines NgRx effects for signup flow
- Injects dependencies using Angular's inject function

```typescript
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
```
- Creates an effect that listens for signup actions
- Calls the auth service's signup method
- Maps the response to a success action
- Catches errors and maps them to a failure action