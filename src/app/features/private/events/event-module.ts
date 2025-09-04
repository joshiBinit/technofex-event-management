import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing-module';
import { EventListComponent } from './components/event-list-component/event-list-component';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from './store/events/event.effect';
import { MaterialModule } from '../../../shared/material.module';
import { eventsReducer } from './store/events/event.reducer';
import { SharedModule } from '../../../shared/shared-module';
import { bookingReducer } from './store/event-booking/event-booking.reducer';
import { EventBookingEffects } from './store/event-booking/event-booking.effects';

@NgModule({
  declarations: [EventListComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    MaterialModule,
    SharedModule,
    StoreModule.forFeature('events', eventsReducer),
    StoreModule.forFeature('booking', bookingReducer),
    EffectsModule.forFeature([EventsEffects, EventBookingEffects]),
  ],
})
export class EventModule {}
