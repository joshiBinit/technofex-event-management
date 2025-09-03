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
  private apiUrl = 'http://localhost:3000'; // json-server default URL

  constructor(private router: Router, private http: HttpClient) {}

  /** Login user */
  login(user: {
    username: string;
    password: string;
    role: 'user' | 'admin';
  }): Observable<any> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      switchMap((users) => {
        const existingUser = users.find(
          (u: User) =>
            (u.username === user.username || u.email === user.username) &&
            u.password === user.password &&
            u.role === user.role
        );

        if (existingUser) {
          const token = this.generateToken();
          const authData: any = {
            id: (existingUser as any).id, // get runtime id
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

        console.log('Login failed, no matching user found');
        return of(null);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  /** Signup user */
  signup(user: User): Observable<{ user: User; token: string }> {
    return this.http
      .post<User>(`${this.apiUrl}/users`, {
        ...user,
        role: user.role || 'user',
        bookings: user.bookings || [],
      })
      .pipe(
        map((createdUser) => {
          const token = this.generateToken();
          const authData: any = {
            id: (createdUser as any).id, // get runtime id
            token,
            username: createdUser.username,
            role: createdUser.role!,
            email: createdUser.email || createdUser.username,
            bookings: createdUser.bookings || [],
          };

          localStorage.setItem(this.localStorageKey, JSON.stringify(authData));
          return { user: createdUser, token };
        })
      );
  }

  /** Logout user */
  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/login']);
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.localStorageKey);
  }

  /** Get current user data */
  getCurrentUser(): (User & { token?: string; bookings?: Event[] }) | null {
    const authData = localStorage.getItem(this.localStorageKey);
    return authData ? JSON.parse(authData) : null;
  }

  /** Get current user role */
  getRole(): 'user' | 'admin' | null {
    const authData = localStorage.getItem(this.localStorageKey);
    return authData ? JSON.parse(authData).role : null;
  }

  /** Add a booked event for current user and save to json-server */
  addBooking(event: Event): Observable<'soldout' | 'duplicate' | User | null> {
    const currentUser: any = this.getCurrentUser();
    if (!currentUser) return of(null);

    // Prevent duplicate booking
    if (currentUser.bookings?.some((e: Event) => e.id === event.id)) {
      return of('duplicate' as 'duplicate');
    }

    // Fetch latest event from server
    return this.http.get<Event>(`${this.apiUrl}/events/${event.id}`).pipe(
      switchMap((serverEvent) => {
        if (!serverEvent) return of(null);

        // Check tickets availability
        if (
          serverEvent.availableTickets !== undefined &&
          serverEvent.availableTickets <= 0
        ) {
          return of('soldout' as 'soldout');
        }

        // 1️⃣ Update event availableTickets
        const updatedEvent: Event = {
          ...serverEvent,
          availableTickets:
            (serverEvent.availableTickets ?? serverEvent.totalTickets) - 1,
        };

        const updateEvent$ = this.http.patch<Event>(
          `${this.apiUrl}/events/${event.id}`,
          { availableTickets: updatedEvent.availableTickets }
        );

        // 2️⃣ Update user bookings
        const updatedBookings = currentUser.bookings
          ? [...currentUser.bookings, event]
          : [event];
        const updatedUser = { ...currentUser, bookings: updatedBookings };
        localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUser));

        const updateUser$ = this.http.patch<User>(
          `${this.apiUrl}/users/${currentUser.id}`,
          { bookings: updatedBookings }
        );

        // Combine both requests
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

  /** Remove a booked event from current user and update json-server */
  removeBooking(eventId: string): Observable<User | null> {
    const currentUser: any = this.getCurrentUser();
    if (!currentUser || !currentUser.bookings) return of(null);

    const updatedBookings = currentUser.bookings.filter(
      (e: Event) => e.id !== eventId
    );

    // Update localStorage
    const updatedUser = { ...currentUser, bookings: updatedBookings };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUser));

    // Update json-server
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

  /** Generate simple random token */
  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /** Fetch all users */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
