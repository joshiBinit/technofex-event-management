import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared-module';
import { EventBookingEffects } from './events/store/event-booking/event-booking.effects';
import { bookingReducer } from './events/store/event-booking/event-booking.reducer';
import { EventsEffects } from './events/store/events/event.effect';
import { eventsReducer } from './events/store/events/event.reducer';
import { PrivateRoutingModule } from './private-routing-module';
import { SharedLayout } from './shared-layout/shared-layout';
import { EventModule } from './events/event-module';

@NgModule({
  declarations: [SharedLayout],
  imports: [CommonModule, PrivateRoutingModule, SharedModule, MaterialModule],
})
export class PrivateModule {}
