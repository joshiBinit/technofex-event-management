import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardModule } from './dashboard_module/dashboard-module';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () =>
      import('./dashboard_module/dashboard-module').then(
        (m) => DashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
