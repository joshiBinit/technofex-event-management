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
@Component({
  selector: 'app-event-list-component',
  standalone: false,
  templateUrl: './event-list-component.html',
  styleUrl: './event-list-component.scss',
})
export class EventListComponent {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  displayedColumns: string[] = [
    'title',
    'category',
    'date',
    'location',
    'tickets',
    'price',
    'actions',
  ];

  constructor(private store: Store<EventsState>) {
    this.events$ = this.store.select(selectAllEvents);
    this.loading$ = this.store.select(selectEventLoading);
  }
  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents());
  }
  onBookNow() {
    alert('Event Added');
  }
}
