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
const { ADMIN, DASHBOARD, USER, LOGIN, SIGNUP } = ROUTE_PATHS;
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

    if (state.url === LOGIN || state.url === SIGNUP) {
      if (isLoggedIn) {
        if (role === admin) {
          return this.router.createUrlTree([ADMIN, DASHBOARD]);
        } else {
          return this.router.createUrlTree([USER, DASHBOARD]);
        }
      }
      return true;
    }
    if (!isLoggedIn) {
      return this.router.createUrlTree([LOGIN]);
    }

    // Role-based access
    if (state.url.startsWith(admin)) {
      if (role !== admin) {
        return this.router.createUrlTree([USER, DASHBOARD]);
      }
    }

    if (state.url.startsWith(user)) {
      if (role !== user) {
        return this.router.createUrlTree([ADMIN, DASHBOARD]);
      }
    }
    return true;
  }
}
