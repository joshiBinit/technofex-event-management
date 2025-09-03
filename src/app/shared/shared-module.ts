import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { HeaderComponent } from './components/header-component/header-component';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { MaterialModule } from './material.module';

import { ProfileComponent } from './components/profile/profile';
import { PaginationComponent } from '../shared/components/pagination/pagination';
import { SearchComponent } from './components/search-component/search-component';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog';
@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    SearchComponent,
    PaginationComponent,
    ConfirmationDialogComponent
  ],
  imports: [CommonModule, SharedRoutingModule, MaterialModule, FormsModule],
  exports: [HeaderComponent, SidebarComponent, PaginationComponent, SearchComponent, ConfirmationDialogComponent],
})
export class SharedModule {}
