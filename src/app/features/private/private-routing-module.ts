import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './shared-layout/shared-layout';
import { AuthGuard } from '../../core/guard/auth-guard-guard';
import { ROUTE_PATHS } from '../../core/constants/routes.constant';
import { admin, NORMAL_USER } from './events/types/user.types';

const { ADMIN, EVENT, USER } = ROUTE_PATHS;
const routes: Routes = [
  {
    path: '',
    component: SharedLayout,
    children: [
      {
        path: ADMIN,
        loadChildren: () =>
          import('./dashboard/dashboard-module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
        data: { role: admin },
      },
      {
        path: EVENT,
        loadChildren: () =>
          import('./events/event-module').then((m) => m.EventModule),
      },
      {
        path: USER,
        loadChildren: () =>
          import('./user/user-module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
        data: { role: NORMAL_USER },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
