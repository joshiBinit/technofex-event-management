import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { HeaderComponent } from './components/header-component/header-component';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { MaterialModule } from './material.module';

import { ProfileComponent } from './components/profile/profile';
import { Pagination } from './components/pagination/pagination';
import { SearchComponent } from './components/search-component/search-component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    SearchComponent,
    Pagination,
  ],
  imports: [CommonModule, SharedRoutingModule, MaterialModule, FormsModule],
  exports: [HeaderComponent, SidebarComponent, Pagination, SearchComponent],
})
export class SharedModule {}
