import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EventsState } from '../../store/events/event.reducer';
import {
  selectAllEvents,
  selectEventLoading,
} from '../../store/events/event.selector';
import * as EventsActions from '../../store/events/event.action';
import { Event } from '../../../../../shared/model/event.model';
import { selectLoginRole } from '../../../../public/login/store/login-component.selectors';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrl: './event-list-component.scss',
})
export class EventListComponent {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  role$: Observable<string | null>;
  displayedColumns: string[] = [
    'title',
    'category',
    'date',
    'location',
    'tickets',
    'price',
    'actions',
  ];

  constructor(private store: Store<EventsState>, private router: Router) {
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventLoading);
    this.role$ = this.store.select(selectLoginRole);
  }
  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents());
  }
  onBookNow() {
    alert('Event Added');
  }

  onAddEvent() {
    this.router.navigate(['/admin/addevent']);
  }
}
