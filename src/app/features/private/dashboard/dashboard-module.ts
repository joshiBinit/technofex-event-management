import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './component/dashboard/dashboard';
import { StoreModule } from '@ngrx/store';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { AddEventComponent } from './component/add-event/add-event';
import { ReactiveFormsModule } from '@angular/forms';
import { eventsReducer } from '../events/store/events/event.reducer';
import { EventsEffects } from '../events/store/events/event.effect';
import { UserComponent } from './component/user-component/user-component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { MaterialModule } from '../../../shared/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UpdateEventComponent } from './component/update-event-component/update-event-component';
import { dashboardEventReducer } from './store/dashboard-event/dashboard-event.reducer';
import { DashboardEventEffects } from './store/dashboard-event/dashboard-event.effect';

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
    // StoreModule.forFeature('events', eventsReducer),
    StoreModule.forFeature('dashboardEvents', dashboardEventReducer),
    HttpClientModule,
    NgApexchartsModule,
    EffectsModule.forFeature(DashboardEventEffects),
    MaterialModule,
  ],
})
export class DashboardModule {}
