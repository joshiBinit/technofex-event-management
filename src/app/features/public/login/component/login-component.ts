import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ROUTE_PATHS } from '../../../../core/constants/routes.constant';
import { FormService } from '../../../../core/services/form/form-service';
import * as LoginActions from '../store/login-component.actions';
import { LoginState } from '../store/login-component.reducer';
import {
  selectLoginError,
  selectLoginLoading,
} from '../store/login-component.selectors';
import { AUTH_FORM_KEYS } from '../../constant/auth-form-keys.constant';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error$!: Observable<string | null>;
  loading$!: Observable<boolean>;
  returnUrl: string = '/';
  route_path = ROUTE_PATHS;
  authFormKey = AUTH_FORM_KEYS;

  showPassword = false;

  constructor(
    private store: Store<{ login: LoginState }>,
    private formService: FormService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formService.loginForm();

    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
    });

    this.error$ = this.store.select(selectLoginError);
    this.loading$ = this.store.select(selectLoginLoading);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get(this.authFormKey.EMAIL)?.value;
      const password = this.loginForm.get(this.authFormKey.PASSWORD)?.value;
      const isAdminAttempt = email === 'admin@test.com';
      const role = isAdminAttempt ? 'admin' : 'user';

      this.store.dispatch(
        LoginActions.login({
          username: email,
          password,
          role,
          returnUrl: this.returnUrl,
        })
      );

      console.log('Login attempt:', {
        username: email,
        password,
        role,
        returnUrl: this.returnUrl,
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
