import { Injectable } from '@angular/core';
import { User } from '../../shared/model/user.model';
import { Router } from '@angular/router';
import { Observable, of, throwError, catchError, map, tap, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = 'authData';
  private apiUrl = 'http://localhost:3000'; // json-server default URL
  
  constructor(private router: Router, private http: HttpClient) {}

  // Admin is already in db.json file

  login(user: any): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        // Check if the user is trying to login with email or username
        const existingUser = users.find(
          (u: any) => (u.username === user.username || u.email === user.username) && u.password === user.password
        );

        if (existingUser) {
          const authData = {
            token: this.generateToken(),
            username: existingUser.username,
            role: existingUser.role,
            // Store additional user data if needed
            email: existingUser.email || existingUser.username
          };
          localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
          console.log('Login successful with user:', existingUser);
          return true;
        }
        console.log('Login failed, no matching user found');
        return false;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  signup(user: User): Observable<{ user: User; token: string }> {
    // First check if user already exists
    return this.http.get<User[]>(`${this.apiUrl}/users?username=${user.username}`).pipe(
      map(users => {
        if (users.length > 0) {
          throw new Error('Username already exists'); // will be caught by effect
        }
        
        // Set default role to 'user' if not provided
        const newUser = { ...user, role: user.role || 'user' };
        
        // Add user to db.json
        return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
          map(createdUser => {
            const token = this.generateToken();
            const authData = { 
              username: createdUser.username, 
              role: createdUser.role, 
              token,
              email: createdUser.email || createdUser.username
            };
            localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
            
            // Log signup data to console
            console.log('User signed up:', { username: createdUser.username, email: createdUser.email, role: createdUser.role });
            
            return { user: createdUser, token };
          })
        );
      }),
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => new Error(error.message || 'Username already exists'));
      })
    ).pipe(
      // Flatten the nested Observable
      mergeMap(obs => obs)
    );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.localStorageKey);
  }

  getRole(): 'user' | 'admin' | null {
    const authData = localStorage.getItem(this.localStorageKey);
    return authData ? JSON.parse(authData).role : null;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
