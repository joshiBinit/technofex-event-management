import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validator that checks if password and confirmPassword fields match
   * @returns A validator function that returns null if passwords match, or an error object if they don't
   */
  static passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      // If either control doesn't exist, return null
      if (!password || !confirmPassword) {
        return null;
      }

      // Return null if controls haven't been touched yet or passwords match
      if (confirmPassword.pristine || password.value === confirmPassword.value) {
        return null;
      }

      // Set error on confirmPassword if values don't match
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    };
  }
}