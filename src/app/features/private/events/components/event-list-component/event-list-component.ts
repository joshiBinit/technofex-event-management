import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrls: ['./event-list-component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  private store = inject(Store<EventsState>);

  events$: Observable<Event[]> = this.store.select(selectAllEvents);
  loading$: Observable<boolean> = this.store.select(selectEventLoading);
  role$: Observable<string | null> = this.store.select(selectLoginRole);

  allEvents: Event[] = [];
  filteredEvents: Event[] = [];
  displayedEvents: Event[] = [];

  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageEvent!: PageEvent;

  searchFields: string[] = ['title', 'category', 'location'];
  filterTimeout: any;
  debounceTime: number = 300;
  filterValue: string = '';

  private destroy$ = new Subject<void>();

  @ViewChild('pagination') paginationComponent!: PaginationComponent;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.events$.pipe(takeUntil(this.destroy$)).subscribe((events) => {
      this.allEvents = events;
      this.filteredEvents = events;
      this.totalItems = events?.length ?? 0;

      if (this.paginationComponent) {
        this.paginationComponent.setFilteredData(events);
      }

      this.updateDisplayedEvents();
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
          this.store.dispatch(BookedEventsActions.bookEvent({ event }));
        } else {
          this.showSnackBar(
            `❌ Failed to book ${event.title}. Try again!`,
            'error'
          );
        }
      });
  }

  /**
   * Handle paginator page changes
   */
  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedEvents();
  }

  /**
   * Apply filter to events with debounce
   */
  applyFilter(event: KeyboardEvent): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      const filterValue = (event.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
      this.filterValue = filterValue;

      if (filterValue) {
        this.filteredEvents = this.allEvents.filter(
          (item) =>
            item.title?.toLowerCase().includes(filterValue) ||
            item.category?.toLowerCase().includes(filterValue) ||
            item.location?.toLowerCase().includes(filterValue)
        );
      } else {
        this.filteredEvents = [...this.allEvents];
      }

      this.totalItems = this.filteredEvents.length;
      this.pageIndex = 0;

      this.pageEvent = {
        pageIndex: 0,
        pageSize: this.pageSize,
        length: this.totalItems,
      };

      this.updateDisplayedEvents();
    }, this.debounceTime);
  }

  /**
   * Update displayed events based on page and size
   */
  updateDisplayedEvents(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.displayedEvents = this.filteredEvents.slice(startIndex, endIndex);

    if (
      this.displayedEvents.length === 0 &&
      this.filteredEvents.length > 0 &&
      this.pageIndex > 0
    ) {
      this.pageIndex = Math.max(
        0,
        Math.ceil(this.filteredEvents.length / this.pageSize) - 1
      );
      this.updateDisplayedEvents();
    }
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this event?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.eventService.deleteEvent(eventId).subscribe({
            next: () => {
              this.showSnackBar('✅ Event deleted successfully', 'success');
              this.loadEvents();
            },
            error: (err) => {
              console.error('Failed to delete event:', err);
              this.showSnackBar(
                '❌ Failed to delete event. Please try again.',
                'error'
              );
            },
          });
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
}
