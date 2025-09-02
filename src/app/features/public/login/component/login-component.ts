import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as LoginActions from '../store/login-component.actions';
import { LoginState } from '../store/login-component.reducer';
import { FormService } from '../../../../core/services/form/form-service';
import {
  selectLoginError,
  selectLoginLoading,
} from '../store/login-component.selectors';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error$!: Observable<string | null>;
  loading$!: Observable<boolean>;

  private fb = inject(FormBuilder);
  private store = inject(Store<{ login: LoginState }>);
  private formService = inject(FormService);

  ngOnInit(): void {
    this.loginForm = this.formService.loginForm();
    localStorage.getItem('users')

    this.error$ = this.store.select(selectLoginError);
    this.loading$ = this.store.select(selectLoginLoading);
  }

  showPassword = false;

togglePassword(): void {
  this.showPassword = !this.showPassword;
}


  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const isAdminAttempt = email === 'admin@test.com';
      const role = isAdminAttempt ? 'admin' : 'user';

      this.store.dispatch(
        LoginActions.login({ username: email, password, role })
      );

      console.log('Login attempt:', { username: email, password, role });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
