import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './component/add-event/add-event';
import { DashboardComponent } from './component/dashboard/dashboard';
import { UpdateEventComponent } from './component/update-event-component/update-event-component';
import { UserComponent } from './component/user-component/user-component';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

const { DASHBOARD, ADD_EVENT, UPDATE_EVENT, USER, LIST } = ROUTE_PATHS;
const routes: Routes = [
  { path: DASHBOARD, component: DashboardComponent },
  { path: ADD_EVENT, component: AddEventComponent },
  { path: `${UPDATE_EVENT}/:id`, component: UpdateEventComponent },
  {
    path: USER,
    children: [{ path: LIST, component: UserComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
