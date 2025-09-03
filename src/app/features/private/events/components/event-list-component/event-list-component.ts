import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { EventsState } from '../../store/events/event.reducer';
import {
  selectAllEvents,
  selectEventLoading,
} from '../../store/events/event.selector';
import * as EventsActions from '../../store/events/event.action';
import { Event } from '../../../../../shared/model/event.model';
import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { selectLoginRole } from '../../../../public/login/store/login-component.selectors';
import { Router } from '@angular/router';
import { EventService } from '../../../../../core/services/event/event-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrls: ['./event-list-component.scss'],
})
export class EventListComponent implements OnInit {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  role$: Observable<string | null>;

  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  filterEvents: Event[] = [];

  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  searchFields: string[] = ['title', 'category', 'location'];

  @ViewChild('pagination') paginationComponent!: PaginationComponent;

  constructor(
    private store: Store<EventsState>,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventLoading);
    this.role$ = this.store.select(selectLoginRole);
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.store.dispatch(EventsActions.loadEvents());

    this.events$.subscribe((events) => {
      if (events && events.length > 0) {
        this.allEvents = events;
        this.totalItems = events.length;

        if (this.paginationComponent) {
          this.paginationComponent.setFilteredData(events);
        }
      }
    });
  }

  getDisplayedColumns(): Observable<string[]> {
    return this.role$.pipe(
      map((role) =>
        role === 'admin'
          ? [
              'title',
              'category',
              'date',
              'location',
              'tickets',
              'availableTickets',
              'price',
              'actions',
            ]
          : [
              'title',
              'category',
              'date',
              'location',
              'availableTickets',
              'price',
              'actions',
            ]
      )
    );
  }

  /** Book event: updates localStorage, json-server, and NgRx store */
  onBookNow(event: Event) {
    this.authService.addBooking(event).subscribe((user) => {
      if (user) {
        alert(`${event.title} booked successfully!`);
        this.store.dispatch(BookedEventsActions.bookEvent({ event }));
      } else {
        alert('Failed to book event. Try again!');
      }
    });
  }

  onPaginatedDataChanged(data: Event[]): void {
    this.displayedEvents = data;
  }

  onFilteredDataChanged(data: Event[]): void {
    if (this.paginationComponent) {
      this.paginationComponent.setFilteredData(data);
    }
  }

  onAddEvent() {
    this.router.navigate(['/admin/addevent']);
  }

  onUpdateEvent(eventId: string) {
    this.router.navigate(['/admin/updateevent', eventId]);
  }

  onDeleteEvent(eventId: string) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this event?'
    );
    if (confirmDelete) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          alert('Event deleted successfully!');
          this.loadEvents();
        },
        error: (err) => {
          console.error('Failed to delete event:', err);
          alert('Failed to delete event. Please try again.');
        },
      });
    }
  }

  onSearchChanged(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
  }
}
