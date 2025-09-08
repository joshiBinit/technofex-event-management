import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/component/login-component';
import { SignupComponent } from './signup/component/signup-component';
import { AuthGuard } from '../../core/guard/auth-guard-guard';
import { ROUTE_PATHS } from '../../core/constants/routes.constant';

const { LOGIN, SIGNUP } = ROUTE_PATHS;

export const routes: Routes = [
  { path: LOGIN, component: LoginComponent, canActivate: [AuthGuard] },
  { path: SIGNUP, component: SignupComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: LOGIN, pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
