import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing-module';

import { BookingListComponent } from './booking-list-component/booking-list-component';
import { BookingDetailComponent } from './booking-detail-component/booking-detail-component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [BookingListComponent, BookingDetailComponent],
  imports: [CommonModule, BookingRoutingModule, MaterialModule],
})
export class BookingModule {}
