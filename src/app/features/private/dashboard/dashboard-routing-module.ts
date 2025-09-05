import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './component/add-event/add-event';
import { DashboardComponent } from './component/dashboard/dashboard';
import { UpdateEventComponent } from './component/update-event-component/update-event-component';
import { UserComponent } from './component/user-component/user-component';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

const routes: Routes = [
  { path: ROUTE_PATHS.DASHBOARD, component: DashboardComponent },
  { path: ROUTE_PATHS.ADD_EVENT, component: AddEventComponent },
  { path: `${ROUTE_PATHS.UPDATE_EVENT}/:id`, component: UpdateEventComponent },
  { path: ROUTE_PATHS.USER_LIST, component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
