import { Component, OnInit } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Event } from '../../../../../shared/model/event.model';
import { EventService } from '../../../../../core/services/event/event-service';
import { selectAllEvents } from '../../../events/store/events/event.selector';
import { loadEvents } from '../../../events/store/events/event.action';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  // totalBookings$: Observable<number>;
  events$: Observable<Event[]>;

  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'description',
    'date',
    'time',
    'location',
    'totalTickets',
    'price',
  ];

  chartOptions: ApexOptions = {
    series: [],
    chart: { type: 'pie', width: 380 }, // must always be defined
    labels: [], // must always be array
    plotOptions: { pie: { expandOnClick: true } }, // must always be defined
    responsive: [
      // must always be array
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  constructor(private store: Store, private eventService:EventService) {
    // this.totalBookings$ = this.store.select(selectTotalBookings);
    this.events$ = this.store.select(selectAllEvents);
  }

  ngOnInit(): void {
    //dispatch action to loadevents
    this.store.dispatch(loadEvents());

    this.events$.subscribe((events) => {
      this.chartOptions.series = events?.map((e) => e.totalTickets) || [];
      this.chartOptions.labels = events?.map((e) => e.title) || [];
    });
  }
}
