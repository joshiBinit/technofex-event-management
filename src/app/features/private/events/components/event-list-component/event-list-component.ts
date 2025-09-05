import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import {
  selectAllEvents,
  selectEventLoading,
} from '../../store/events/event.selector';
import {
  selectBookingSuccessMessage,
  selectBookingError,
} from '../../store/event-booking/event-booking.selector';
import * as EventsActions from '../../store/events/event.action';
import { Event } from '../../../../../shared/model/event.model';
import { selectLoginRole } from '../../../../public/login/store/login-component.selectors';
import { Router } from '@angular/router';
import { EventService } from '../../../../../core/services/event/event-service';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination';
import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import * as BookingActions from '../../store/event-booking/event-booking.action';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar-service';
import { admin, ADMIN, NORMAL_USER, searchTerm } from '../../types/user.types';

@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrls: ['./event-list-component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  events$: Observable<Event[]> = this.store.select(selectAllEvents);
  loading$: Observable<boolean> = this.store.select(selectEventLoading);
  role$: Observable<string | null> = this.store.select(selectLoginRole);
  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  searchFields: string[] = searchTerm;
  private destroy$ = new Subject<void>();
  totalItems$ = this.events$.pipe(map((events) => events?.length ?? 0));

  @ViewChild('pagination') paginationComponent!: PaginationComponent;

  constructor(private router: Router, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents());
    this.events$.pipe(takeUntil(this.destroy$)).subscribe((events) => {
      this.allEvents = events;
      this.totalItems = events?.length ?? 0;

      if (this.paginationComponent) {
        this.paginationComponent.setFilteredData(events);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDisplayedColumns(): Observable<string[]> {
    return this.role$.pipe(
      map((role) => (role === admin ? ADMIN : NORMAL_USER))
    );
  }

  onBookNow(event: Event) {
    this.store.dispatch(BookingActions.bookEvent({ event }));
  }

  onPaginatedDataChanged(data: Event[]): void {
    this.displayedEvents = data;
  }

  onFilteredDataChanged(data: Event[]): void {
    if (this.paginationComponent) {
      this.paginationComponent.setFilteredData(data);
    }
    this.displayedEvents = data;
  }

  onAddEvent() {
    this.router.navigate(['/admin/addevent']);
  }

  onUpdateEvent(eventId: string) {
    this.router.navigate(['/admin/update-event', eventId]);
  }

  onDeleteEvent(eventId: string) {
    this.dialogService
      .openDeleteDialog(
        'Delete Event',
        'Are you sure you want to delete this event?',
        'Delete',
        'cancel'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(EventsActions.deleteEvent({ eventId }));
        }
      });
  }

  onSearchChanged(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
  }
}
