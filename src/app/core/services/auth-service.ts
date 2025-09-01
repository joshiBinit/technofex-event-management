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
  constructor(private router: Router) {}

  login(user: User): boolean {
    const users = this.getUsers();
    const existingUser = users.find(
      (u) => u.username === user.username && u.password === user.password
    );

    if (existingUser) {
      const token = this.generateToken();
      const authData = {
        username: existingUser.username,
        role: existingUser.role,
        token,
      };
      localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
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

    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    const token = this.generateToken();
    const authData = { username: user.username, role: user.role, token };
    localStorage.setItem(this.localStorageKey, JSON.stringify(authData));

    return of({ user, token });
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
