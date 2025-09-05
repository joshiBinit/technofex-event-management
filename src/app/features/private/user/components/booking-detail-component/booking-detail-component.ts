import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
<<<<<<< HEAD

=======
>>>>>>> 45c8d0458d3d35b587d0737da029b7c134e20eee
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';

import { EventService } from '../../../../../core/services/event/event-service';

@Component({
  selector: 'app-booking-detail-component',
  standalone: false,
  templateUrl: './booking-detail-component.html',
  styleUrls: ['./booking-detail-component.scss'],
})
export class BookingDetailComponent implements OnInit {
<<<<<<< HEAD
  eventDetail!: Event;
=======
  event: Event | null = null;

>>>>>>> 45c8d0458d3d35b587d0737da029b7c134e20eee
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
<<<<<<< HEAD
      const eventId = params.get('id');
      if (eventId) {
        this.eventService.getEventById(eventId).subscribe({
          next: (event) => {
            this.eventDetail = event;
          },
          error: (err) => {
            console.error('Failed to fetch event:', err);
=======
      const id = params.get('id');
      if (id) {
        this.eventService.getEventById(id).subscribe({
          next: (data) => (this.event = data),
          error: (err) => {
            console.error('❌ Failed to load event', err);
            this.event = null;
>>>>>>> 45c8d0458d3d35b587d0737da029b7c134e20eee
          },
        });
      }
    });
  }
}
