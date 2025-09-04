import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './component/add-event/add-event';
import { DashboardComponent } from './component/dashboard/dashboard';
import { UpdateEventComponent } from './component/update-event-component/update-event-component';
import { UserComponent } from './component/user-component/user-component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'addevent', component: AddEventComponent },
  { path: 'updateevent/:id', component: UpdateEventComponent },
  { path: 'userlist', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
