import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './shared-layout/shared-layout';

const routes: Routes = [
  {
    path: '',
    component: SharedLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'event',
        loadChildren: () =>
          import('./events/event-module').then((m) => m.EventModule),
      },
      // { path: 'user', component: UserComponent },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
