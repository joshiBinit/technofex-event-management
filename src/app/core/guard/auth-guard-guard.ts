import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole() || ''; // "admin" | "user" | ""

    //Prevent logged-in users from visiting login/register
    if (state.url === '/login' || state.url === '/signup') {
      if (isLoggedIn) {
        this.snackbar.open('You are already logged in', 'Close', 
          { 
            duration: 3000,
            horizontalPosition: 'right', 
            verticalPosition: 'top', 
            panelClass: ['snackbar-info'] 
          });
        if (role === 'admin') {
          return this.router.createUrlTree(['/admin/dashboard']);
        } else {
          return this.router.createUrlTree(['/user/dashboard']);
        }
      }
      return true; // allow access to login/register if NOT logged in
    }

    //Block access to protected routes if not logged in
    if (!isLoggedIn) {
              this.snackbar.open('Please log in to continue.', 'Close', 
          { 
            duration: 3000,
            horizontalPosition: 'right', 
            verticalPosition: 'top', 
            panelClass: ['snackbar-info'] 
          });
      return this.router.createUrlTree(['/login']);
    }

    // Role-based access
    if (state.url.startsWith('/admin')) {
      if (role !== 'admin') {
          this.snackbar.open('Access denied.', 'Close',
          { 
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        return this.router.createUrlTree(['/user/dashboard']);
      }
    }

    if (state.url.startsWith('/user')) {
      if (role !== 'user') {
          this.snackbar.open('Access denied.', 'Close',
          { 
            duration: 3000,
            horizontalPosition: 'right',  
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        return this.router.createUrlTree(['/admin/dashboard']);
      }
    }

    return true;
  }
}
