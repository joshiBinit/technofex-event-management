import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './component/dashboard/dashboard';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Store, StoreModule } from '@ngrx/store';
import { eventReducer } from '../dashboard/store/dashboard.reducers';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { RouterModule, Routes } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { AddEventComponent } from './component/add-event/add-event';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserComponent } from './component/user-component/user-component';

@NgModule({
  declarations: [DashboardComponent, AddEventComponent, UserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgApexchartsModule,
    MatCardModule,
    MatTableModule,
    DashboardRoutingModule,
    StoreModule.forFeature('events', eventReducer),
  ],
})
export class DashboardModule {}
