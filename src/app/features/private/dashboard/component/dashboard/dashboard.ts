import { Component, OnInit } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectAllEvents,
  selectTotalBookings,
  selectTotalUsers,
} from '../../store/dashboard.selectors';
import { map } from 'rxjs';

export interface Event {
  name: string;
  date?: string;
  location?: string;
  bookings: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  events$: Observable<Event[]>;
  totalUsers$: Observable<number>;
  totalBookings$: Observable<number>;

  displayedColumns: string[] = ['name', 'date', 'location', 'bookings'];

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

  constructor(private store: Store) {
    this.events$ = this.store.select(selectAllEvents);
    this.totalUsers$ = this.store.select(selectTotalUsers);
    this.totalBookings$ = this.store.select(selectTotalBookings);
  }

  ngOnInit(): void {
    this.events$.subscribe((events) => {
      this.chartOptions.series = events?.map((e) => e.bookings) || [];
      this.chartOptions.labels = events?.map((e) => e.name) || [];
    });
  }
}
