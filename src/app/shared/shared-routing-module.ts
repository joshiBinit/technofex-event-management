import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile';
import { ROUTE_PATHS } from '../core/constants/routes.constant';

const routes: Routes = [
  { path: ROUTE_PATHS.PROFILE, component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
