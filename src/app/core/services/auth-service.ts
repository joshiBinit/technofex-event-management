import { Injectable } from '@angular/core';
import { User } from '../../shared/model/user.model';
import { Router } from '@angular/router';
import { Observable, of, catchError, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../shared/model/event.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = 'authData';
  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  login(user: {
    username: string;
    password: string;
    role: 'user' | 'admin';
    returnUrl?: string;
  }): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      switchMap((users) => {
        // TODO: make util to transform data
        const existingUser = users.find(
          (u: User) =>
            (u.username === user.username || u.email === user.username) &&
            u.password === user.password &&
            u.role === user.role
        );

        if (existingUser) {
          const token = this.generateToken();
          const authData: any = {
            id: (existingUser as any).id,
            token,
            username: existingUser.username,
            role: existingUser.role!,
            email: existingUser.email || existingUser.username,
            bookings: existingUser.bookings || [],
          };

          localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
          console.log('Login successful:', existingUser);
          return of(authData);
        }

        // console.log('');
        throw new Error('Login failed, no matching user found');
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  signup(user: User): Observable<{ user: User; token: string }> {
    return this.http
      .post<User>(`${this.apiUrl}/users`, {
        ...user,
        role: user.role || 'user',
        bookings: user.bookings || [],
      })
      .pipe(
        map((createdUser) => {
          // TODO: make util to transform data
          const token = this.generateToken();
          const authData: any = {
            id: (createdUser as any).id,
            token,
            username: createdUser.username,
            role: createdUser.role,
            email: createdUser.email || createdUser.username,
            bookings: createdUser.bookings || [],
          };

          localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
          return { user: createdUser, token };
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.localStorageKey);
  }

  getCurrentUser(): (User & { token?: string; bookings?: Event[] }) | null {
    const authData = localStorage.getItem(this.localStorageKey);
    return authData ? JSON.parse(authData) : null;
  }

  getRole(): 'user' | 'admin' | null {
    const authData = localStorage.getItem(this.localStorageKey);
    return authData ? JSON.parse(authData).role : null;
  }

  addBooking(event: Event): Observable<'soldout' | 'duplicate' | User | null> {
    // TODO: Shift logic
    const currentUser: any = this.getCurrentUser();
    if (!currentUser) return of(null);

    if (currentUser.bookings?.some((e: Event) => e.id === event.id)) {
      return of('duplicate' as 'duplicate');
    }

    return this.http.get<Event>(`${this.apiUrl}/events/${event.id}`).pipe(
      switchMap((serverEvent) => {
        if (!serverEvent) return of(null);

        if (
          serverEvent.availableTickets !== undefined &&
          serverEvent.availableTickets <= 0
        ) {
          return of('soldout' as 'soldout');
        }

        const updatedEvent: Event = {
          ...serverEvent,
          availableTickets:
            (serverEvent.availableTickets ?? serverEvent.totalTickets) - 1,
        };

        const updateEvent$ = this.http.patch<Event>(
          `${this.apiUrl}/events/${event.id}`,
          { availableTickets: updatedEvent.availableTickets }
        );

        const updatedBookings = currentUser.bookings
          ? [...currentUser.bookings, event]
          : [event];
        const updatedUser = { ...currentUser, bookings: updatedBookings };
        localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUser));

        const updateUser$ = this.http.patch<User>(
          `${this.apiUrl}/users/${currentUser.id}`,
          { bookings: updatedBookings }
        );

        return updateEvent$.pipe(
          switchMap(() => updateUser$),
          map((user) => user),
          catchError((err) => {
            console.error('Failed to book event:', err);
            return of(null);
          })
        );
      })
    );
  }

  // removeBooking(user: User): Observable<User | null> {
  removeBooking(eventId: string): Observable<User | null> {
    // TODO: Priority 1
    const currentUser: any = this.getCurrentUser();
    if (!currentUser || !currentUser.bookings) return of(null);

    const updatedBookings = currentUser.bookings.filter(
      (e: Event) => e.id !== eventId
    );

    const updatedUser = { ...currentUser, bookings: updatedBookings };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUser));

    return this.http
      .patch<User>(`${this.apiUrl}/users/${currentUser.id}`, {
        bookings: updatedBookings,
      })
      .pipe(
        map((user) => user),
        catchError((err) => {
          console.error('Failed to remove booking:', err);
          return of(null);
        })
      );
  }

  private generateToken(): string {
    // TODO: Make a variable to store 36
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
