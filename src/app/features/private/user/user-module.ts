import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';
import { MaterialModule } from '../../../shared/material.module';

import { StoreModule } from '@ngrx/store';
import { eventsReducer } from '../events/store/events/event.reducer';
import { EventListComponent } from '../events/components/event-list-component/event-list-component';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from '../events/store/events/event.effect';
import { EventBookingEffects } from '../events/store/event-booking/event-booking.effects';
import { bookingReducer } from '../events/store/event-booking/event-booking.reducer';

@NgModule({
  declarations: [UserDashboardComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    StoreModule.forFeature('booking', bookingReducer),
    EffectsModule.forFeature([EventBookingEffects]),
  ],
})
export class UserModule {}
