import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLayout } from './features/private/shared-layout/shared-layout';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/public/public-module').then((m) => m.PublicModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./shared/shared-module').then((m) => m.SharedModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/private/private-module').then((m) => m.PrivateModule),
  },

  // fallback route
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
