import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
