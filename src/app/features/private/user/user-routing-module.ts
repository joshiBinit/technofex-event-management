import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';

import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    component: UserDashboardComponent,
  },
  {
    path: `${ROUTE_PATHS.BOOKING_Detail}/:id`,
    component: BookingDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
