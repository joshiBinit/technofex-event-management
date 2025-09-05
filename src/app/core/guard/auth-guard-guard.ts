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
import { ROUTE_PATHS } from '../constants/routes.constant';
import { admin, user } from '../../features/private/events/types/user.types';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = this.authService.getRole() || '';

    if (!isLoggedIn) {
      return this.router.createUrlTree([ROUTE_PATHS.LOGIN]);
    }

    if (state.url === ROUTE_PATHS.LOGIN || state.url === ROUTE_PATHS.SIGNUP) {
      if (role === admin) {
        return this.router.createUrlTree([ROUTE_PATHS.ADMIN_DASHBOARD]);
      } else {
        return this.router.createUrlTree([ROUTE_PATHS.USER_DASHBOARD]);
      }
    }

    // Role-based access
    if (state.url.startsWith(admin)) {
      if (role !== admin) {
        return this.router.createUrlTree([ROUTE_PATHS.USER_DASHBOARD]);
      }
    }

    if (state.url.startsWith(user)) {
      if (role !== user) {
        return this.router.createUrlTree([ROUTE_PATHS.ADMIN_DASHBOARD]);
      }
    }
    return true;
  }
}
