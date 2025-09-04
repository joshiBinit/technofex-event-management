import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';

@Component({
  selector: 'app-booking-detail-component',
  standalone: false,
  templateUrl: './booking-detail-component.html',
  styleUrls: ['./booking-detail-component.scss'],
})
export class BookingDetailComponent implements OnInit {
  selectedBookedEvents$!: Observable<Event | null>;
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    // this.selectedBookedEvents$ = this.route.queryParamMap.pipe(
    //   map((params) => params.get('id')),
    //   switchMap((bookedEventId) =>
    //     this.store.select(selectBookedEvents).pipe(
    //       map((events) => {
    //         const foundEvent =
    //           events.find((event) => event.id?.toString() === bookedEventId) ??
    //           null;
    //         return foundEvent;
    //       })
    //     )
    //   )
    // );
    this.route.queryParamMap.subscribe((params) => {
      const eventId = params.get('id');
      console.log('Query param ', eventId);
    });
  }
}
