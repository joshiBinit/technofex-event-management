import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './shared-layout/shared-layout';

const routes: Routes = [
  {
    path: '',
    component: SharedLayout,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user-module').then((m) => m.UserModule),
      },

      {
        path: 'event',
        loadChildren: () =>
          import('./events/event-module').then((m) => m.EventModule),
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
