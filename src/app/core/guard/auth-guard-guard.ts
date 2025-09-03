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

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole() || '';

    if (state.url === '/login') {
      if (isLoggedIn) {
        if (role === 'admin') {
          return this.router.createUrlTree(['/admin/dashboard']);
        } else {
          return this.router.createUrlTree(['/user/dashboard']);
        }
      }
      return true;
    }

    if (!isLoggedIn) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    if (state.url.includes('/admin/dashboard')) {
      if (role !== 'admin') {
        return this.router.createUrlTree(['/user/dashboard']);
      }
      return true;
    }

    if (state.url.includes('/user/dashboard')) {
      if (role !== 'user') {
        return this.router.createUrlTree(['/admin/dashboard']);
      }
      return true;
    }

    if (route.data['role']) {
      const allowedRoles = route.data['role'] as string[];
      if (!allowedRoles.includes(role)) {
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
