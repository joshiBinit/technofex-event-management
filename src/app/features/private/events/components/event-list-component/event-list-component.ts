import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EventsState } from '../../store/events/event.reducer';
import {
  selectAllEvents,
  selectEventLoading,
} from '../../store/events/event.selector';
import * as EventsActions from '../../store/events/event.action';
import { Event } from '../../../../../shared/model/event.model';
import { PageEvent } from '@angular/material/paginator';
import { selectLoginRole } from '../../../../public/login/store/login-component.selectors';
import { Router } from '@angular/router';
import { EventService } from '../../../../../core/services/event/event-service';

@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrl: './event-list-component.scss',
})
export class EventListComponent implements OnInit {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  role$: Observable<string | null>;
  displayedColumns: string[] = [
    'title',
    'category',
    'date',
    'location',
    'tickets',
    'price',
    'actions',
  ];

  // Pagination properties
  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

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

  loadEvents(): void {
    this.store.dispatch(EventsActions.loadEvents());

    this.events$.subscribe((events) => {
      this.allEvents = events;
      this.totalItems = events.length;
      this.updateDisplayedEvents();
    });
  }

  /**
   * Handle page changes from the paginator
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedEvents();
  }

  /**
   * Update the displayed events based on current page and page size
   */
  updateDisplayedEvents(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedEvents = this.allEvents.slice(startIndex, endIndex);
  }

  onBookNow() {
    alert('Event Added');
  }

  onAddEvent() {
    this.router.navigate(['/admin/addevent']);
  }

  onUpdateEvent(eventId: number) {
    this.router.navigate(['/admin/updateevent', eventId]);
  }

  onDeleteEvent(eventId: number) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this event?'
    );
    if (confirmDelete) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          alert('Event deleted successfully!');
          // Reload events after deletion
          this.loadEvents();
        },
        error: (err) => {
          console.error('Failed to delete event:', err);
          alert('Failed to delete event. Please try again.');
        },
      });
    }
  }
}
