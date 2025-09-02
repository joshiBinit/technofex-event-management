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

  

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private formService = inject(FormService);
  private store = inject(Store<{ signup: SignupState }>);

  ngOnInit(): void {
    // Add 'username' control
    this.signupForm = this.formService.signupForm();
    this.signupForm.setValidators(this.passwordMatchValidator);

    this.error$ = this.store.select(selectSignupError);
    this.loading$ = this.store.select(selectSignupLoading);
  }

  passwordMatchValidator(
    group: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      // Dispatch signup action including username
      // Role is set to 'user' by default in the effects
      this.store.dispatch(SignupActions.signup({ username, email, password }));
      // Log signup attempt to console
      console.log('Signup attempt:', {
        username,
        email,
        password,
        role: 'user',
      });
      // Don't navigate immediately - let the effect handle it
    } else {
      this.signupForm.markAllAsTouched();
      
    }
  }
}
