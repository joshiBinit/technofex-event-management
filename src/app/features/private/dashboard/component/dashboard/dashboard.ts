import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Event } from '../../../../../shared/model/event.model';
import { AuthService } from '../../../../../core/services/auth-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { selectAllEvents } from '../../../events/store/events/event.selector';
import { loadEvents } from '../../../events/store/events/event.action';
import { computeEventsWithBookings } from '../../utils/event-utils';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  events$: Observable<Event[]>;
  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'ticketsBooked',
    'date',
    'time',
    'location',
    'totalTickets',
    'price',
  ];

  eventsWithBookings: (Event & { ticketsBooked: number })[] = [];
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private authService: AuthService) {
    this.events$ = this.store.select(selectAllEvents);
  }

  ngOnInit(): void {
    this.store.dispatch(loadEvents());

    combineLatest([this.events$, this.authService.getUsers()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([events, users]) => {
        this.eventsWithBookings = computeEventsWithBookings(events, users);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
