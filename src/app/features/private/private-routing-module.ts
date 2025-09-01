import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './shared-layout/shared-layout';

const routes: Routes = [
  {
    path: 'private',
    component: SharedLayout,
    children: [
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'events', component: EventsComponent },
      // { path: 'user', component: UserComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
