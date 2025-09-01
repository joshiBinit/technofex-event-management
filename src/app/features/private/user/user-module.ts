import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';
import { MaterialModule } from '../../../shared/material.module';
import { BookingListComponent } from './components/booking-list-component/booking-list-component';
import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';

@NgModule({
  declarations: [UserDashboardComponent, BookingListComponent, BookingDetailComponent],
  imports: [CommonModule, UserRoutingModule, MaterialModule],
})
export class UserModule {}
