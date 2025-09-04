import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';

import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserDashboardComponent,
  },

  {
    path: 'booking-detail',
    component: BookingDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
