import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../events/services/event-service';
import { Event } from '../../../../../shared/model/event.model';
@Component({
  selector: 'app-user-dashboard-component',
  standalone: false,
  templateUrl: './user-dashboard-component.html',
  styleUrl: './user-dashboard-component.scss',
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = [];
  constructor(private eventService: EventService) {}
  ngOnInit() {
    this.eventService
      .getRandomEvents(3)
      .subscribe((data) => (this.events = data));
  }
}
