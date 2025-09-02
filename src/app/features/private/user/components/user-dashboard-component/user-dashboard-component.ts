import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../core/services/event/event-service';
import { Event } from '../../../../../shared/model/event.model';
import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { Store } from '@ngrx/store';
import * as BookedEventActions from '../../../events/store/booked-events/booked-events.action';
import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
import { Observable } from 'rxjs';
import { selectBookedEvents } from '../../../events/store/booked-events/booked-events.store';
@Component({
  selector: 'app-user-dashboard-component',
  standalone: false,
  templateUrl: './user-dashboard-component.html',
  styleUrl: './user-dashboard-component.scss',
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = [];

  constructor(
    private eventService: EventService,
    private store: Store<BookedEventsState>
  ) {
    this.bookedEvents$ = this.store.select(selectBookedEvents);
  }
  ngOnInit() {
    this.eventService
      .getRandomEvents(3)
      .subscribe((data) => (this.events = data));
    this.store.dispatch(BookedEventActions.loadBookedEvents());
  }
  onBookNow(event: Event) {
    this.store.dispatch(BookedEventsActions.bookEvent({ event }));
    alert(`${event.title} added`);
  }
  bookedEvents$: Observable<Event[]>;
  displayedColumns: string[] = [
    'title',
    'category',
    'date',
    'time',
    'tickets',
    'price',
    'actions',
  ];
}
