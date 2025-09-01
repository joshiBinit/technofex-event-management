import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './features/private/shared-layout/shared-layout';

const routes: Routes = [
  {
    path: '',
    component: SharedLayout,
    children: [
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'events', component: EventsComponent },
      // { path: 'user', component: UserComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // public routes (example)
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/public/login/login-module').then((m) => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./features/public/signup/signup-module').then(
        (m) => m.SignupModule
      ),
  },

  // fallback route
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
