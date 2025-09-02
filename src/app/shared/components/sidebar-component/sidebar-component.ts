import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { selectLoginRole } from '../../../features/public/login/store/login-component.selectors';
import { AuthService } from '../../../core/services/auth-service';

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
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.role$.subscribe((role) => {
      console.log('Current role:', role);
      if (role === 'admin') {
        console.log('User is admin');
      } else {
        console.log('User is not admin');
      }
    });
  }

  dashboardRedirect(): void {
    this.role$.subscribe((role) => {
      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user/dashboard']);
      }
    });
  }
  eventListRedirect(): void {
    this.role$.pipe(take(1)).subscribe((role) => {
      if (role === 'admin') {
        this.router.navigate(['/admin/event/list']);
      } else {
        this.router.navigate(['/user/event/list']);
      }
    });
  }
}
