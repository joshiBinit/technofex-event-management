import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard';
import { AddEventComponent } from './component/add-event/add-event';
import { UserComponent } from './component/user-component/user-component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'addevent', component: AddEventComponent },
  { path: 'userlist', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
