import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { selectLoginRole } from '../../../features/public/login/store/login-component.selectors';
import { AuthService } from '../../../core/services/auth-service';
import { ROUTE_PATHS } from '../../../core/constants/routes.constant';
import { admin } from '../../../features/private/events/types/user.types';

@Component({
  selector: 'app-sidebar-component',
  standalone: false,
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent implements OnInit {
  role$: Observable<string | null>;
  private store = inject(Store<{ login: LoginState }>);
  constructor(private router: Router, private authService: AuthService) {
    this.role$ = this.store.select(selectLoginRole);
  }
  logout() {
    this.authService.logout();
    this.router.navigate([ROUTE_PATHS.LOGIN]);
  }

  ngOnInit(): void {}

  dashboardRedirect(): void {
    this.role$.subscribe((role) => {
      if (role === admin) {
        this.router.navigate([ROUTE_PATHS.ADMIN_DASHBOARD]);
      } else {
        this.router.navigate([ROUTE_PATHS.USER_DASHBOARD]);
      }
    });
  }
  eventListRedirect(): void {
    this.router.navigate([ROUTE_PATHS.EVENT_LIST]);
  }
}
