import { Component, OnInit } from '@angular/core';
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';
import * as BookingActions from '../../../events/store/event-booking/event-booking.action';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth-service';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import {
  selectBookingError,
  selectBookingSuccessMessage,
} from '../../../events/store/event-booking/event-booking.selector';
import { userDashboardTable } from '../../user-table.type';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar-service';

@Component({
  selector: 'app-user-dashboard-component',
  standalone: false,
  templateUrl: './user-dashboard-component.html',
  styleUrls: ['./user-dashboard-component.scss'],
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = [];
  bookedEvents: Event[] = [];
  private destroy$ = new Subject<void>();
  displayedColumns = userDashboardTable;
  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private dialogService: DialogService,
    private store: Store,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.eventService
      .getRandomEvents(3)
      .subscribe((data) => (this.events = data));
    const currentUser = this.authService.getCurrentUser();
    this.bookedEvents = currentUser?.bookings || [];
    this.store
      .select(selectBookingSuccessMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        if (msg) this.snackbarService.show(msg, 'success');
        const currentUser = this.authService.getCurrentUser();
        this.bookedEvents = currentUser?.bookings || [];
      });

    this.store
      .select(selectBookingError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((err) => {
        if (err) this.snackbarService.show(err, 'error');
      });
  }

  onBookNow(event: Event) {
    this.store.dispatch(BookingActions.bookEvent({ event }));
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
                    this.snackbarService.show(
                      `✅ Booking cancelled for ${event.title}`,
                      'info'
                    );
                  },
                  error: () => {
                    this.snackbarService.show(
                      `❌ Failed to update tickets for ${event.title}`,
                      'error'
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
