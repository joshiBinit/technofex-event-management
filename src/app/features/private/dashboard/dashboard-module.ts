import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from '../../../shared/material.module';
import { locationsEffect } from '../../../shared/store/location/location.effect';
import { locationReducer } from '../../../shared/store/location/location.reducer';
import { EventsEffects } from '../events/store/events/event.effect';
import { AddEventComponent } from './component/add-event/add-event';
import { DashboardComponent } from './component/dashboard/dashboard';
import { UpdateEventComponent } from './component/update-event-component/update-event-component';
import { UserComponent } from './component/user-component/user-component';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { DashboardEventEffects } from './store/dashboard-event/dashboard-event.effect';
import { dashboardEventReducer } from './store/dashboard-event/dashboard-event.reducer';

@NgModule({
  declarations: [
    AddEventComponent,
    UserComponent,
    DashboardComponent,
    UpdateEventComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    StoreModule.forFeature('dashboardEvents', dashboardEventReducer),

    StoreModule.forFeature('locations', locationReducer),
    NgApexchartsModule,
    EffectsModule.forFeature([
      EventsEffects,
      DashboardEventEffects,
      locationsEffect,
    ]),
    MaterialModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class DashboardModule {}
