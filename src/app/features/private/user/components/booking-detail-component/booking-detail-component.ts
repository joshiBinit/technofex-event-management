import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
import { selectBookedEvents } from '../../../events/store/booked-events/booked-events.selector';
import { Observable } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { loadBookedEvents } from '../../../events/store/booked-events/booked-events.action';

@Component({
  selector: 'app-booking-detail-component',
  standalone: false,
  templateUrl: './booking-detail-component.html',
  styleUrls: ['./booking-detail-component.scss'],
})
export class BookingDetailComponent implements OnInit {
  [x: string]: any;
  EventsFromBookedEvents$!: Observable<Event[]>;
  selectedBookedEvents$!: Observable<Event | null>;
  constructor(
    private route: ActivatedRoute,
    private store: Store<BookedEventsState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadBookedEvents());

    this.selectedBookedEvents$ = this.route.queryParamMap.pipe(
      map((params) => params.get('id')),
      switchMap((bookedEventId) =>
        this.store.select(selectBookedEvents).pipe(
          map((events) => {
            const foundEvent =
              events.find((event) => event.id?.toString() === bookedEventId) ??
              null;
            return foundEvent;
          })
        )
      )
    );
  }
}
