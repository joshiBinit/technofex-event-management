import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list-component/booking-list-component';
import { BookingDetailComponent } from './booking-detail-component/booking-detail-component';

const routes: Routes = [
  {
    path: 'booking-list',
    component: BookingListComponent,
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
export class BookingRoutingModule {}
