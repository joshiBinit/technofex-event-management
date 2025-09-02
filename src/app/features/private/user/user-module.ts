import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';
import { MaterialModule } from '../../../shared/material.module';
import { BookingListComponent } from './components/booking-list-component/booking-list-component';
import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';
import { StoreModule } from '@ngrx/store';
import { eventsReducer } from '../events/store/events/event.reducer';
import { EventListComponent } from '../events/components/event-list-component/event-list-component';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from '../events/store/events/event.effect';

@NgModule({
  declarations: [
    UserDashboardComponent,
    BookingListComponent,
    BookingDetailComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    StoreModule.forFeature('events', eventsReducer),
    EffectsModule.forFeature([EventsEffects]),
  ],
})
export class UserModule {}
