import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectLoginUsername } from '../../../features/public/login/store/login-component.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';

@Component({
  selector: 'app-header-component',
  standalone: false,
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  username$: Observable<string | null>;
  mobileMenuOpen = false;
  private store = inject(Store<{ login: LoginState }>);

  constructor(private router: Router) {
    this.username$ = this.store.select(selectLoginUsername);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    // Clear session/token here
    localStorage.removeItem('authData');
    this.router.navigate(['/login']);
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
