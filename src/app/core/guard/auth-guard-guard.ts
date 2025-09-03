import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole() || ''; // Ensure it's a string
    
    // Handle login page access
    if (state.url === '/login') {
      // If already logged in, redirect to appropriate dashboard
      if (isLoggedIn) {
        if (role === 'admin') {
          return this.router.createUrlTree(['/admin/dashboard']);
        } else {
          return this.router.createUrlTree(['/user/dashboard']);
        }
      }
      // Not logged in, allow access to login page
      return true;
    }
    
    // For protected routes, check if user is logged in
    if (!isLoggedIn) {
      // Store the attempted URL for redirection after login
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // Handle admin dashboard access
    if (state.url.includes('/admin/dashboard')) {
      if (role !== 'admin') {
        // If not admin, redirect to user dashboard
        return this.router.createUrlTree(['/user/dashboard']);
      }
      return true;
    }

    // Handle user dashboard access
    if (state.url.includes('/user/dashboard')) {
      if (role !== 'user') {
        // If not user, redirect to admin dashboard
        return this.router.createUrlTree(['/admin/dashboard']);
      }
      return true;
    }

    // Role-based route access for other routes
    if (route.data['role']) {
      const allowedRoles = route.data['role'] as string[];
      if (!allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on role
        if (role === 'admin') {
          return this.router.createUrlTree(['/admin/dashboard']);
        } else {
          return this.router.createUrlTree(['/user/dashboard']);
        }
      }
    }

    return true;
  }
}
