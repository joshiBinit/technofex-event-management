import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardModule } from './dashboard_module/dashboard-module';

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: '',

        loadChildren: () =>
          import('./dashboard_module/dashboard-module').then(
            (m) => DashboardModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./booking_module/booking-module').then(
            (m) => m.BookingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
