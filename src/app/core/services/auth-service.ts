import { Injectable } from '@angular/core';
import { User } from '../../shared/model/user.model';
import { Router } from '@angular/router';
import { Observable, of, catchError, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../shared/model/event.model';
import { authenticate, signupUser } from '../utils/auth-utils';
import { clearAuthData, getAuthData } from '../utils/local-storage-utils';
import { loggedInUser } from '../utils/user.type';
import {
  addEventToUser,
  canBookEvent,
  decrementEventTickets,
  removeEventFromUser,
} from '../utils/booking-utiils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = 'authData';
  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  login(user: loggedInUser): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map((users) => authenticate(users, user)),
      catchError((error) => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  signup(user: User): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      map((savedUser) => signupUser(savedUser)),
      catchError((error) => {
        console.error('Signup error:', error);
        return of(null);
      })
    );
  }

  logout(): void {
    clearAuthData();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!getAuthData();
  }

  getCurrentUser(): (User & { token?: string; bookings?: Event[] }) | null {
    return getAuthData();
  }

  getRole(): 'user' | 'admin' | null {
    const authData = getAuthData();
    return authData ? authData.role : null;
  }

  addBooking(event: Event): Observable<'soldout' | 'duplicate' | User | null> {
    const currentUser: any = this.getCurrentUser();
    if (!currentUser) return of(null);

    return this.http.get<Event>(`${this.apiUrl}/events/${event.id}`).pipe(
      switchMap((serverEvent) => {
        const status = canBookEvent(currentUser, serverEvent);
        if (status !== 'ok') return of(status);
        // It handles the logic of tickets count and also the updatedUser handles the logic of adding that particular event to that Users param
        const updatedEvent = decrementEventTickets(serverEvent);
        const updatedUser = addEventToUser(currentUser, event);
        localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUser));

        return this.http
          .patch<Event>(`${this.apiUrl}/events/${event.id}`, {
            availableTickets: updatedEvent.availableTickets,
          })
          .pipe(
            switchMap(() =>
              this.http.patch<User>(`${this.apiUrl}/users/${currentUser.id}`, {
                bookings: updatedUser.bookings,
              })
            ),
            catchError((err) => {
              console.error('Failed to book event:', err);
              return of(null);
            })
          );
      })
    );
  }

  removeBooking(eventId: string): Observable<User | null> {
    const currentUser: any = this.getCurrentUser();
    if (!currentUser) return of(null);
    const updatedUser = removeEventFromUser(currentUser, eventId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUser));
    return this.http
      .patch<User>(`${this.apiUrl}/users/${currentUser.id}`, {
        bookings: updatedUser.bookings,
      })
      .pipe(
        catchError((err) => {
          console.error('Failed to remove booking:', err);
          return of(null);
        })
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
