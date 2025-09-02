import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing-module';
import { SharedLayout } from './shared-layout/shared-layout';
import { SharedModule } from '../../shared/shared-module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StoreModule } from '@ngrx/store';
import { bookedEventsReducer } from './events/store/booked-events/booked-events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BookedEventsEffects } from './events/store/booked-events/booked-events.effect';

@NgModule({
  declarations: [SharedLayout],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    MatSidenavModule,
    StoreModule.forFeature('bookedEvents', bookedEventsReducer),
    EffectsModule.forFeature(BookedEventsEffects),
  ],
})
export class PrivateModule {}
