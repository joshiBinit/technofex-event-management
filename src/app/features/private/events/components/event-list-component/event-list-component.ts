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
  filteredEvents: Event[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageEvent: PageEvent = { pageIndex: 0, pageSize: 10, length: 0 };
  
  // Filter
  filterValue = '';
  filterTimeout: any;
  debounceTime = 300; // ms



  constructor(private store: Store<EventsState>, private router: Router) {

    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventLoading);
    this.role$ = this.store.select(selectLoginRole);
  }

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents());
    
    // Subscribe to events to get the total count and initialize pagination
    this.events$.subscribe(events => {
      if (events && events.length > 0) {
        this.allEvents = events;
        this.filteredEvents = [...events]; // Initialize filtered events with all events
        this.totalItems = events.length;
        this.pageEvent = { 
          pageIndex: this.pageIndex, 
          pageSize: this.pageSize, 
          length: this.totalItems 
        };
        this.updateDisplayedEvents();
      }
    });
  }

  /**
   * Handle page changes from the paginator
   */
  onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedEvents();
  }

  /**
   * Apply filter to events with debouncing
   */
  applyFilter(event: KeyboardEvent): void {
    // Clear any existing timeout to implement debouncing
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    
    // Set a new timeout
    this.filterTimeout = setTimeout(() => {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filterValue = filterValue;
      
      if (filterValue) {
        this.filteredEvents = this.allEvents.filter(item => 
          item.title?.toLowerCase().includes(filterValue) ||
          item.category?.toLowerCase().includes(filterValue) ||
          item.location?.toLowerCase().includes(filterValue)
        );
      } else {
        this.filteredEvents = [...this.allEvents];
      }
      
      this.totalItems = this.filteredEvents.length;
      this.pageIndex = 0; // Reset to first page when filtering
      this.pageEvent = { pageIndex: 0, pageSize: this.pageSize, length: this.totalItems };
      this.updateDisplayedEvents();
    }, this.debounceTime);
  }

  /**
   * Update the displayed events based on current page and page size
   */
  updateDisplayedEvents(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    // Slice the filtered data array to get only the items for current page
    this.displayedEvents = this.filteredEvents.slice(startIndex, endIndex);
    
    // Ensure we don't show an empty page if we have data
    if (this.displayedEvents.length === 0 && this.filteredEvents.length > 0 && this.pageIndex > 0) {
      // If current page is empty but we have data, go to the last page with data
      this.pageIndex = Math.max(0, Math.ceil(this.filteredEvents.length / this.pageSize) - 1);
      this.updateDisplayedEvents();
    }
  }
  
  onBookNow() {
    alert('Event Added');
  }

  onAddEvent() {
    this.router.navigate(['/admin/addevent']);
  }
}
