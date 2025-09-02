import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing-module';
import { SharedLayout } from './shared-layout/shared-layout';
import { SharedModule } from '../../shared/shared-module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [SharedLayout],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule,
    MatSidenavModule,
    MatNativeDateModule,
  ],
})
export class PrivateModule {}
