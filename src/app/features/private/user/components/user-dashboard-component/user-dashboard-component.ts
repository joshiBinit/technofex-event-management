import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../core/services/event/event-service';
import { Event } from '../../../../../shared/model/event.model';
import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { Store } from '@ngrx/store';

import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
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
  ) {}
  ngOnInit() {
    this.eventService
      .getRandomEvents(3)
      .subscribe((data) => (this.events = data));
  }
  onBookNow(event: Event) {
    this.store.dispatch(BookedEventsActions.bookEvent({ event }));
  }
}
