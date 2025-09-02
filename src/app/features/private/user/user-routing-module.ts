import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';
import { BookingListComponent } from './components/booking-list-component/booking-list-component';
import { BookingDetailComponent } from './components/booking-detail-component/booking-detail-component';
import { EventListComponent } from '../events/components/event-list-component/event-list-component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'booking-list',
    component: BookingListComponent,
  },
  {
    path: 'booking-detail',
    component: BookingDetailComponent,
  },
  {
    path: 'event/list',
    component: EventListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
