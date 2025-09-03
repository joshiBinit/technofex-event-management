import { Component, OnInit } from '@angular/core';
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';

import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { Store } from '@ngrx/store';
import * as BookedEventActions from '../../../events/store/booked-events/booked-events.action';
import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
import { Observable } from 'rxjs';
import { selectBookedEvents } from '../../../events/store/booked-events/booked-events.selector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../core/services/auth-service';

@Component({
  selector: 'app-user-dashboard-component',
  standalone: false,
  templateUrl: './user-dashboard-component.html',
  styleUrls: ['./user-dashboard-component.scss'],
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = [];
  bookedEvents$: Observable<Event[]>;
  bookedEvents: Event[] = []; // bookings from localStorage
  displayedColumns: string[] = [
    'title',
    'category',
    'date',
    'time',
    'tickets',
    'price',
    'actions',
  ];

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private store: Store<BookedEventsState>
  ) {
    this.bookedEvents$ = this.store.select(selectBookedEvents);
  }
  ngOnInit() {
    this.eventService
      .getRandomEvents(3)
      .subscribe((data) => (this.events = data));
    this.store.dispatch(BookedEventActions.loadBookedEvents());
    // Load booked events from the current user in localStorage
    const currentUser = this.authService.getCurrentUser();
    this.bookedEvents = currentUser?.bookings || [];
  }
  onBookNow(event: Event) {
    this.authService.addBooking(event); // adds to user bookings in localStorage
    this.bookedEvents = this.authService.getCurrentUser()?.bookings || [];
    this.store.dispatch(BookedEventsActions.bookEvent({ event }));
    this.snackBar.open(`✅ ${event.title} added successfully`, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  onCancelBooking(eventId: string) {
    // Remove booking from localStorage first
    this.authService.removeBooking(eventId);
    this.bookedEvents = this.authService.getCurrentUser()?.bookings || [];

    // Fetch the event from server
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        if (event) {
          // Increase availableTickets by 1
          const updatedEvent: Event = {
            ...event,
            availableTickets:
              (event.availableTickets ?? event.totalTickets) + 1,
          };

          // Update event in JSON server
          this.eventService.updateEvent(eventId, updatedEvent).subscribe({
            next: () => {
              this.snackBar.open(
                `✅ Booking cancelled and tickets updated for ${event.title}`,
                'Close',
                {
                  duration: 3000,
                  panelClass: ['snackbar-success'],
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                }
              );

              // Dispatch NgRx action to remove booking from store
              this.store.dispatch(
                BookedEventsActions.cancelBooking({ eventId })
              );
            },
            error: (err) => {
              console.error('Failed to update event:', err);
              this.snackBar.open(
                `❌ Failed to update tickets for ${event.title}`,
                'Close',
                {
                  duration: 3000,
                  panelClass: ['snackbar-error'],
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                }
              );
            },
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch event:', err);
      },
    });
  }
}
