import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination';
import { Event } from '../../../../../shared/model/event.model';
import { selectLoginRole } from '../../../../public/login/store/login-component.selectors';
import {
  selectBookingError,
  selectBookingSuccessMessage,
} from '../../store/event-booking/event-booking.selector';
import * as EventsActions from '../../store/events/event.action';
import {
  selectAllEvents,
  selectEventLoading,
} from '../../store/events/event.selector';

import { DialogService } from '../../../../../core/services/dialog/dialog.service';
import * as BookingActions from '../../store/event-booking/event-booking.action';
import { admin, ADMIN, NORMAL_USER } from '../../types/user.types';

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

  searchFields: string[] = ['title', 'category', 'location'];

  private destroy$ = new Subject<void>();

  @ViewChild('pagination') paginationComponent!: PaginationComponent;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.events$.pipe(takeUntil(this.destroy$)).subscribe((events) => {
      this.allEvents = events;
      this.totalItems = events?.length ?? 0;

      if (this.paginationComponent) {
        this.paginationComponent.setFilteredData(events);
      }
    });
    this.store
      .select(selectBookingSuccessMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        if (msg) this.showSnackBar(msg, 'success');
        this.store.dispatch(BookingActions.clearBookingMessages());
      });

    this.store
      .select(selectBookingError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((err) => {
        if (err) this.showSnackBar(err, 'error');
        this.store.dispatch(BookingActions.clearBookingMessages());
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    this.store.dispatch(EventsActions.loadEvents());
  }

  getDisplayedColumns(): Observable<string[]> {
    return this.role$.pipe(
      map((role) => (role === admin ? ADMIN : NORMAL_USER))
    );
  }

  onBookNow(event: Event) {
    console.log('booked');
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
    this.router.navigate(['/admin/updateevent', eventId]);
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
          this.eventService.deleteEvent(eventId).subscribe({
            next: () => {
              this.dialogService.openSuccessDialog(
                'Event Deleted',
                'The event has been deleted successfully.',
                'OK'
              );
              this.loadEvents();
            },
            error: (err) => {
              console.error('Failed to delete event:', err);
              this.dialogService.openWarningDialog(
                'Deletion Failed',
                'Failed to delete the event. Please try again.',
                'OK',
                'Cancel'
              );
            },
          });
        }
      });
  }

  onSearchChanged(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [type === 'success' ? 'snackbar-success' : 'snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
