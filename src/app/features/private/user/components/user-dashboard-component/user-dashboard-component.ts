import { Component, OnInit } from '@angular/core';
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';

import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { Store } from '@ngrx/store';
import * as BookedEventActions from '../../../events/store/booked-events/booked-events.action';
import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectBookedEvents } from '../../../events/store/booked-events/booked-events.selector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../core/services/auth-service';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-user-dashboard-component',
  standalone: false,
  templateUrl: './user-dashboard-component.html',
  styleUrls: ['./user-dashboard-component.scss'],
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = [];
  bookedEvents$: Observable<Event[]>;
  bookedEvents: Event[] = [];
  private destroy$ = new Subject<void>();
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
    private dialogService: DialogService,
    private store: Store<BookedEventsState>
  ) {
    this.bookedEvents$ = this.store.select(selectBookedEvents);
  }
  ngOnInit() {
    this.eventService
      .getRandomEvents(3)
      .subscribe((data) => (this.events = data));
    this.store.dispatch(BookedEventActions.loadBookedEvents());

    const currentUser = this.authService.getCurrentUser();
    this.bookedEvents = currentUser?.bookings || [];
  }
  onBookNow(event: Event) {
    this.authService
      .addBooking(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result === 'duplicate') {
          this.showSnackBar(`❌ ${event.title} is already booked!`, 'error');
        } else if (result === 'soldout') {
          this.showSnackBar(`❌ ${event.title} is sold out!`, 'error');
        } else if (result) {
          this.showSnackBar(`✅ ${event.title} booked successfully`, 'success');

          // Update local store
          this.store.dispatch(BookedEventsActions.bookEvent({ event }));

          // Update bookedEvents array to reflect changes in UI
          this.bookedEvents = this.authService.getCurrentUser()?.bookings || [];
        } else {
          this.showSnackBar(
            `❌ Failed to book ${event.title}. Try again!`,
            'error'
          );
        }
      });
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [type === 'success' ? 'snackbar-success' : 'snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  onCancelBooking(eventId: string) {
  this.dialogService
    .openDeleteDialog(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      'Yes, Cancel',
      'No, Keep'
    )
    .subscribe((confirmed) => {
      if (confirmed) {
        this.authService.removeBooking(eventId);
        this.bookedEvents = this.authService.getCurrentUser()?.bookings || [];

        this.eventService.getEventById(eventId).subscribe({
          next: (event) => {
            if (event) {
              const updatedEvent: Event = {
                ...event,
                availableTickets:
                  (event.availableTickets ?? event.totalTickets) + 1,
              };

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
    });
}

}
