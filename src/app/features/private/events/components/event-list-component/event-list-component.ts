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
  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];



  constructor(private store: Store<EventsState>, private router: Router) {

    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventLoading);
    this.role$ = this.store.select(selectLoginRole);
  }

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents());
    
    // Subscribe to events to get the total count and initialize pagination
    this.events$.subscribe(events => {
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
    
    // Slice the data array to get only the items for current page
    this.displayedEvents = this.allEvents.slice(startIndex, endIndex);
  }
  
  onBookNow() {
    alert('Event Added');
  }

  onAddEvent() {
    this.router.navigate(['/admin/addevent']);
  }
}
