import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { HeaderComponent } from './components/header-component/header-component';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MaterialModule,
  ],
  exports: [HeaderComponent, SidebarComponent],
})
export class SharedModule {}
