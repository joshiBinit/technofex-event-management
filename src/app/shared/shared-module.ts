import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { HeaderComponent } from './components/header-component/header-component';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { MaterialModule } from './material.module';

import { ProfileComponent } from './components/profile/profile';
import { Pagination } from './components/pagination/pagination';
@NgModule({
  declarations: [HeaderComponent, SidebarComponent, ProfileComponent, Pagination],
  imports: [CommonModule, SharedRoutingModule, MaterialModule],
  exports: [HeaderComponent, SidebarComponent, Pagination],
})
export class SharedModule {}
