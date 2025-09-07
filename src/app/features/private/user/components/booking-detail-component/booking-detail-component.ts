import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';
import { ROUTE_PATHS } from '../../../../../core/constants/routes.constant';
@Component({
  selector: 'app-booking-detail-component',
  standalone: false,
  templateUrl: './booking-detail-component.html',
  styleUrls: ['./booking-detail-component.scss'],
})
export class BookingDetailComponent implements OnInit {
  eventDetail!: Event;
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}
  routePaths = ROUTE_PATHS;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('id');
      if (eventId) {
        this.eventService.getEventById(eventId).subscribe({
          next: (event) => {
            this.eventDetail = event;
          },
          error: (err) => {
            console.error('Failed to fetch event:', err);
          },
        });
      }
    });
  }
}
