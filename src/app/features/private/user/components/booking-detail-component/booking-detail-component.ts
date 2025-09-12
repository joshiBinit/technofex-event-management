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
  eventDetail!: Event | null;
  constructor(private route: ActivatedRoute) {}
  routePaths = ROUTE_PATHS;
  ngOnInit(): void {
    this.eventDetail = this.route.snapshot.data['eventDetail'];
  }
}
