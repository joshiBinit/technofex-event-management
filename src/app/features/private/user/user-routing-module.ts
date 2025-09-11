import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';

import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';
import { EventDetailResolver } from './components/booking-detail-component/booking-detail.resolver';

const { DASHBOARD, BOOKING_Detail } = ROUTE_PATHS;
const routes: Routes = [
  {
    path: DASHBOARD,
    component: UserDashboardComponent,
  },
  {
    path: `${BOOKING_Detail}/:id`,
    component: BookingDetailComponent,
    resolve: { eventDetail: EventDetailResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
