import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';
import { selectBookingUser } from '../../../events/store/event-booking/event-booking.selector';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../../../../../core/services/auth-service';
import { User } from '../../../../../shared/model/user.model';

@Component({
  selector: 'app-booking-detail-component',
  standalone: false,
  templateUrl: './booking-detail-component.html',
  styleUrls: ['./booking-detail-component.scss'],
})
export class BookingDetailComponent implements OnInit {
  selectedBookedEvents$!: Observable<Event | null>;
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser() as
      | (User & { id: string; token?: string; bookings?: Event[] })
      | null;

    if (currentUser) {
      this.selectedBookedEvents$ = this.route.queryParamMap.pipe(
        map((params) => params.get('id')),
        switchMap((bookedEventId) =>
          this.authService.getUserById(currentUser.id).pipe(
            map((freshUser) => {
              return (
                freshUser.bookings?.find(
                  (event) => event.id?.toString() === bookedEventId
                ) ?? null
              );
            })
          )
        )
      );
    }
  }
}
