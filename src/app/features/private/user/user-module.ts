import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserDashboardComponent } from './components/user-dashboard-component/user-dashboard-component';
import { MaterialModule } from '../../../shared/material.module';

@NgModule({
  declarations: [UserDashboardComponent],
  imports: [CommonModule, UserRoutingModule, MaterialModule],
})
export class UserModule {}
