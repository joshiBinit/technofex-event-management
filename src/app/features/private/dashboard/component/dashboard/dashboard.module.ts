import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Store, StoreModule } from '@ngrx/store';
import { eventReducer } from '../../dashboard.reducers';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatTableModule,
    StoreModule.forFeature('events', eventReducer),
  ],
})
export class DashboardModule {}
