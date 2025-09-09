import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SignupState } from '../store/signup-component.reducer';
import * as SignupActions from '../store/signup-component.actions';
import {
  selectSignupError,
  selectSignupLoading,
} from '../store/signup-component.selectors';
import { Router } from '@angular/router';
import { FormService } from '../../../../core/services/form/form-service';
import { ROUTE_PATHS } from '../../../../core/constants/routes.constant';

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
  constructor(
    private formService: FormService,
    private store: Store<{ signup: SignupState }>
  ) {}
  ngOnInit(): void {
    this.signupForm = this.formService.signupForm();

    this.error$ = this.store.select(selectSignupError);
    this.loading$ = this.store.select(selectSignupLoading);
  }

  // Password matching is now handled by CustomValidators.passwordsMatch()

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
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
