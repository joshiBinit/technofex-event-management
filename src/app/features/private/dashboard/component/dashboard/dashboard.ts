import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Event } from '../../../../../shared/model/event.model';
import { AuthService } from '../../../../../core/services/auth-service';
import { selectAllEvents } from '../../../events/store/events/event.selector';
import { loadEvents } from '../../../events/store/events/event.action';
import { computeEventsWithBookings } from '../../utils/event-utils';
import { table } from '../../utils/types';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = table;
  eventsWithBookings$: Observable<(Event & { ticketsBooked: number })[]>;
  constructor(private store: Store, private authService: AuthService) {
    const events$ = this.store.select(selectAllEvents);
    const users$ = this.authService.getUsers();
    this.eventsWithBookings$ = combineLatest([events$, users$]).pipe(
      map(([events, users]) => computeEventsWithBookings(events, users))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadEvents());
  }
}
