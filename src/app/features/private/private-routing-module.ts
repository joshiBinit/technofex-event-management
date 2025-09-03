import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './shared-layout/shared-layout';
import { AuthGuard } from '../../core/guard/auth-guard-guard';

const routes: Routes = [
  {
    path: '',
    component: SharedLayout,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./dashboard/dashboard-module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
        data: { role: ['admin'] }
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user-module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
        data: { role: ['user'] }
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
