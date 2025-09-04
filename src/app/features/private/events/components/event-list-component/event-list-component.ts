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
import { DialogService } from '../../../../../core/services/dialog/dialog.service';

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
    this.store.dispatch(BookedEventsActions.bookEvent({ event }));

    this.authService.addBooking(event).subscribe((result) => {
      if (result === 'duplicate') {
        this.snackBar.open(`❌ ${event.title} is already booked!`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        //
        // alert(`${event.title} is already booked!`);
      } else if (result) {
        this.snackBar.open(`✅ ${event.title} booked successfully`, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        //
        // alert(`${event.title} booked successfully!`);
        this.store.dispatch(BookedEventsActions.bookEvent({ event }));
      } else {
        this.snackBar.open(
          `❌ Failed to book ${event.title}. Try again!`,
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        //
        //
        // alert('Failed to book event. Try again!');
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
              this.loadEvents(); // reload events
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
