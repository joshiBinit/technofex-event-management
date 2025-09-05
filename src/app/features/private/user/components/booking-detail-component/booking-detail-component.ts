import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';

@Component({
  selector: 'app-booking-detail-component',
  standalone: false,
  templateUrl: './booking-detail-component.html',
  styleUrls: ['./booking-detail-component.scss'],
})
export class BookingDetailComponent implements OnInit {
  event: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventService.getEventById(id).subscribe({
          next: (data) => (this.event = data),
          error: (err) => {
            console.error('❌ Failed to load event', err);
            this.event = null;
          },
        });
      }
    });
  }
}
