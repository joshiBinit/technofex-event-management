import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing-module';
import { EventListComponent } from './components/event-list-component/event-list-component';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from './store/events/event.effect';
import { MaterialModule } from '../../../shared/material.module';
import { eventsReducer } from './store/events/event.reducer';
import { SearchComponent } from '../../../shared/components/search-component/search-component';
import { SharedModule } from '../../../shared/shared-module';

@NgModule({
  declarations: [EventListComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    StoreModule.forFeature('events', eventsReducer),
    EffectsModule.forFeature(EventsEffects),
    MaterialModule,
    SharedModule,
  ],
})
export class EventModule {}
