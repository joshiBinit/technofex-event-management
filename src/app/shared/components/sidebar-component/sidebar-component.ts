import { Component, inject, OnInit } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { selectLoginRole } from '../../../features/public/login/store/login-component.selectors';
import { AuthService } from '../../../core/services/auth-service';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';
import { admin } from '../../../features/private/events/types/user.types';

const { ADMIN, USER, LOGIN, DASHBOARD, EVENT, LIST } = ROUTE_PATHS;
@Component({
  selector: 'app-sidebar-component',
  standalone: false,
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent implements OnInit {
  role$: Observable<string | null>;
  private store = inject(Store<{ login: LoginState }>);
  route_paths = ROUTE_PATHS;
  admin = admin;
  constructor(private router: Router, private authService: AuthService) {
    this.role$ = this.store.select(selectLoginRole);
  }
  logout() {
    this.authService.logout();
    this.router.navigate([LOGIN]);
  }

  ngOnInit(): void {}

  dashboardRedirect(): void {
    this.role$.subscribe((role) => {
      if (role === admin) {
        this.router.navigate([ADMIN, DASHBOARD]);
      } else {
        this.router.navigate([USER, DASHBOARD]);
      }
    });
  }
  eventListRedirect(): void {
    this.router.navigate([EVENT, LIST]);
  }
}
