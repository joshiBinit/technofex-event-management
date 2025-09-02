import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { HeaderComponent } from './components/header-component/header-component';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { MaterialModule } from './material.module';

import { ProfileComponent } from './components/profile/profile';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search-component/search-component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    SearchComponent,
  ],
  imports: [CommonModule, SharedRoutingModule, MaterialModule, FormsModule],
  exports: [HeaderComponent, SidebarComponent, SearchComponent],
})
export class SharedModule {}
