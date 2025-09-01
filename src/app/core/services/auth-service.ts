import { Injectable } from '@angular/core';
import { User } from '../../shared/model/user.model';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = 'authData';
  private usersKey = 'users'; // store registered users
   private defaultAdmin: User = {
    username: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  };
  constructor(private router: Router) {this.initAdmin();}

   /** Initialize static admin in localStorage if not present */
  private initAdmin(): void {
    const users = this.getUsers();
    const adminExists = users.some(u => u.username === this.defaultAdmin.username);
    if (!adminExists) {
      users.push(this.defaultAdmin);
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  login(user: User): boolean {
    const users = this.getUsers();
    const existingUser = users.find(
      (u) => u.username === user.username && u.password === user.password
    );

    if (existingUser) {
      const token = this.generateToken();
      const authData = {
        username: existingUser.username,
        role: existingUser.role, // role is preserved from the user object
        token,
      };
      // Store auth data in localStorage
      localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
      // Log login data to console
      console.log('User logged in:', { username: existingUser.username, role: existingUser.role });
      return true;
    }

    return false;
  }

  signup(user: User): Observable<{ user: User; token: string }> {
    const users = this.getUsers();
    const userExists = users.some((u) => u.username === user.username);

    if (userExists) {
      throw new Error('Username already exists'); // will be caught by effect
    }

    // Set default role to 'user' if not provided
    const newUser = { ...user, role: user.role || 'user' };
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    const token = this.generateToken();
    const authData = { username: newUser.username, role: newUser.role, token };
    localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
    
    // Log signup data to console
    console.log('User signed up:', { username: newUser.username, email: newUser.email, role: newUser.role });

    return of({ user: newUser, token });
  }

  logout() {
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

  private getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }
}
