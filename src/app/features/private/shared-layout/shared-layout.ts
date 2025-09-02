import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { initializeLogin } from '../../public/login/store/login-component.actions';

@Component({
  selector: 'app-shared-layout',
  standalone: false,
  templateUrl: './shared-layout.html',
  styleUrl: './shared-layout.scss',
})
export class SharedLayout implements OnInit {
  isSidebarOpen = true;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private store: Store) {}

  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const { token, role, username, email } = JSON.parse(authData);
      this.store.dispatch(initializeLogin({ token, role, username, email }));
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isSidebarOpen ? this.sidenav.open() : this.sidenav.close();
  }
}
