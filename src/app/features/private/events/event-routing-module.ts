import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list-component/event-list-component';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

const routes: Routes = [
  {
    path: ROUTE_PATHS.LIST,
    component: EventListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
