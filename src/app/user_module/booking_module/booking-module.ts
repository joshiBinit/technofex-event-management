import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing-module';
import { BookingComponent } from './booking-component/booking-component';
import { BookingListComponent } from './booking-list-component/booking-list-component';
import { BookingDetailComponent } from './booking-detail-component/booking-detail-component';


@NgModule({
  declarations: [
    BookingComponent,
    BookingListComponent,
    BookingDetailComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
