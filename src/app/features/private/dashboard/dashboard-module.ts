import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component/dashboard/dashboard';
import { StoreModule } from '@ngrx/store';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { AddEventComponent } from './component/add-event/add-event';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsEffects } from '../events/store/events/event.effect';
import { UserComponent } from './component/user-component/user-component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { MaterialModule } from '../../../shared/material.module';
import { UpdateEventComponent } from './component/update-event-component/update-event-component';
import { dashboardEventReducer } from './store/dashboard-event/dashboard-event.reducer';
import { DashboardEventEffects } from './store/dashboard-event/dashboard-event.effect';
import { locationReducer } from '../../../shared/store/location/location.reducer';
import { locationsEffect } from '../../../shared/store/location/location.effect';
import { usersReducer } from './store/user-detail/user-detail.reducer';
import { UserEffects } from './store/user-detail/user-detail.effects';
import { eventsReducer } from '../events/store/events/event.reducer';

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
    StoreModule.forFeature('users', usersReducer),
    StoreModule.forFeature('events', eventsReducer),
    HttpClientModule,
    EffectsModule.forFeature([
      EventsEffects,
      DashboardEventEffects,
      locationsEffect,
      UserEffects,
    ]),

    MaterialModule,
  ],
})
export class DashboardModule {}
