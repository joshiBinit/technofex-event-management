import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SignupState } from '../store/signup-component.reducer';
import * as SignupActions from '../store/signup-component.actions';
import {
  selectSignupError,
  selectSignupLoading,
} from '../store/signup-component.selectors';
import { FormService } from '../../../../core/services/form/form-service';
import { ROUTE_PATHS } from '../../../../core/constants/routes.constant';
import { AUTH_FORM_KEYS } from '../../constant/auth-form-keys.constant';
import { hasError } from '../../../../shared/utils/form.util';

@Component({
  selector: 'app-signup-component',
  templateUrl: './signup-component.html',
  styleUrls: ['./signup-component.scss'],
  standalone: false,
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  error$!: Observable<string | null>;
  loading$!: Observable<boolean>;
  showPassword = false;
  showConfirmPassword = false;
  route_path = ROUTE_PATHS;
  authFormKey = AUTH_FORM_KEYS;
  hasError = hasError;
  constructor(
    private formService: FormService,
    private store: Store<{ signup: SignupState }>
  ) {}
  ngOnInit(): void {
    this.signupForm = this.formService.signupForm();

    this.error$ = this.store.select(selectSignupError);
    this.loading$ = this.store.select(selectSignupLoading);
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const email = this.signupForm.get(this.authFormKey.EMAIL)?.value;
      const username = this.signupForm.get(this.authFormKey.USERNAME)?.value;
      const password = this.signupForm.get(this.authFormKey.PASSWORD)?.value;
      console.log(email, username, password);

      this.store.dispatch(SignupActions.signup({ username, email, password }));
      console.log('Signup attempt:', {
        username,
        email,
        password,
        role: 'user',
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
