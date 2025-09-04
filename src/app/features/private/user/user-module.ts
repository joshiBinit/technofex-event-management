import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing-module';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';
import { MaterialModule } from '../../../shared/material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EventBookingEffects } from '../events/store/event-booking/event-booking.effects';
import { bookingReducer } from '../events/store/event-booking/event-booking.reducer';
import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';

@NgModule({
  declarations: [UserDashboardComponent, BookingDetailComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    StoreModule.forFeature('booking', bookingReducer),
    EffectsModule.forFeature([EventBookingEffects]),
  ],
})
export class UserModule {}
