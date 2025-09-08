import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectLoginUsername } from '../../../features/public/login/store/login-component.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';

const { LOGIN, PROFILE } = ROUTE_PATHS;
@Component({
  selector: 'app-header-component',
  standalone: false,
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  username$: Observable<string | null>;
  mobileMenuOpen = false;
  constructor(
    private store: Store<{ login: LoginState }>,
    private router: Router
  ) {
    this.username$ = this.store.select(selectLoginUsername);
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  logout() {
    localStorage.removeItem('authData');
    this.router.navigate([LOGIN]);
  }
  goToProfile() {
    this.router.navigate([PROFILE]);
  }
}
