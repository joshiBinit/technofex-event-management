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
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrl: './event-list-component.scss',
})
export class EventListComponent implements OnInit {
  // Observables
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  role$: Observable<string | null>;

  // Data properties
  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  filterEvents: Event[] = [];
  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  // Search fields for the search component
  searchFields: string[] = ['title', 'category', 'location'];

  // Reference to pagination component
  @ViewChild('pagination') paginationComponent!: PaginationComponent;

  constructor(
    private store: Store<EventsState>,
    private router: Router,
    private eventService: EventService
  ) {
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventLoading);
    this.role$ = this.store.select(selectLoginRole);
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  /**
   * Load all events and initialize pagination
   */
  loadEvents(): void {
    this.store.dispatch(EventsActions.loadEvents());

    this.events$.subscribe((events) => {
      if (events && events.length > 0) {
        this.allEvents = events;
        this.totalItems = events.length;

        // Pass all events to pagination to manage slicing
        if (this.paginationComponent) {
          this.paginationComponent.setFilteredData(events);
        }
      }
    });
  }

  /**
   * Determine table columns based on user role
   */
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

  /**
   * Handle booking an event
   */
  onBookNow(event: Event) {
    this.store.dispatch(BookedEventsActions.bookEvent({ event }));
    alert(`${event.title} added`);
  }

  /**
   * Handle paginated data emitted by the pagination component
   */
  onPaginatedDataChanged(data: Event[]): void {
    this.displayedEvents = data;
  }

  /**
   * Handle filtered data from the search component
   */
  onFilteredDataChanged(data: Event[]): void {
    if (this.paginationComponent) {
      this.paginationComponent.setFilteredData(data);
    }
  }

  /**
   * Navigation to add event page
   */
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

  /**
   * Placeholder for search term changes (used by search component)
   */
  onSearchChanged(searchTerm: string) {
    console.log('Search term:', searchTerm);
    // Filtering logic is handled by the search component, which emits filtered data
  }

  /**
   * Optional: handle page change events if needed
   */
  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    // Currently pagination component handles slicing automatically
  }
}
