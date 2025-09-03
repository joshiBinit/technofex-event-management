import { Component, OnInit } from '@angular/core';
import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectBookedEvents } from '../../../events/store/booked-events/booked-events.selector';
import { Event } from '../../../../../shared/model/event.model';
import * as BookedEventActions from '../../../events/store/booked-events/booked-events.action';
@Component({
  selector: 'app-booking-list-component',
  standalone: false,
  templateUrl: './booking-list-component.html',
  styleUrl: './booking-list-component.scss',
})
export class BookingListComponent implements OnInit {
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
  constructor(private store: Store<BookedEventsState>) {
    this.bookedEvents$ = this.store.select(selectBookedEvents);
  }
  ngOnInit() {
    this.store.dispatch(BookedEventActions.loadBookedEvents());
  }
  cancelBooking() {}
}
