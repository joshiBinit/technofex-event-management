import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './component/dashboard/dashboard';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Store, StoreModule } from '@ngrx/store';
import { eventReducer } from '../dashboard/store/dashboard.reducers';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatCardModule,
    MatTableModule,
    StoreModule.forFeature('events', eventReducer),
  ],
})
export class DashboardModule {}
