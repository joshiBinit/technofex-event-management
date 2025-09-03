import { Component, OnInit } from '@angular/core';
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';
import { AuthService } from '../../../../../core/services/auth-service';

@Component({
  selector: 'app-user-dashboard-component',
  standalone: false,
  templateUrl: './user-dashboard-component.html',
  styleUrls: ['./user-dashboard-component.scss'],
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = []; // recommended events
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Fetch recommended events
    this.eventService.getRandomEvents(3).subscribe((data) => {
      this.events = data;
    });

    // Load booked events from the current user in localStorage
    const currentUser = this.authService.getCurrentUser();
    this.bookedEvents = currentUser?.bookings || [];
  }

  /** Book event and update localStorage */
  onBookNow(event: Event) {
    this.authService.addBooking(event); // adds to user bookings in localStorage
    this.bookedEvents = this.authService.getCurrentUser()?.bookings || [];
  }

  /** Cancel a booking */
  onCancelBooking(eventId: string) {
    this.authService.removeBooking(eventId);
    this.bookedEvents = this.authService.getCurrentUser()?.bookings || [];
  }
}
