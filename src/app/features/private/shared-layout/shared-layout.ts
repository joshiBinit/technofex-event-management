import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-shared-layout',
  standalone: false,
  templateUrl: './shared-layout.html',
  styleUrl: './shared-layout.scss',
})
export class SharedLayout {
  isSidebarOpen = true;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isSidebarOpen ? this.sidenav.open() : this.sidenav.close();
  }
}
