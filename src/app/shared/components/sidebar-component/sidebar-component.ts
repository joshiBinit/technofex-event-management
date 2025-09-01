import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { selectLoginRole } from '../../../features/public/login/store/login-component.selectors';

@Component({
  selector: 'app-sidebar-component',
  standalone: false,
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent {
  role$: Observable<string | null>;

  private store = inject(Store<{ login: LoginState }>);
  constructor(private router: Router) {
    this.role$ = this.store.select(selectLoginRole);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
