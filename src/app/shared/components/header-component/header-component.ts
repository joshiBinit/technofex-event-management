import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-component',
  standalone: false,
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    // Clear session/token here
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
