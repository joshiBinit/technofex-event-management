import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  VALIDATION_CONSTANTS,
  VALIDATION_PATTERNS,
} from '../../constants/validation.constant';
import { CustomValidators } from '../../validators/custom-validators';
import { EVENT_FORM_KEYS } from '../../../features/private/dashboard/constants/event-form-keys.constant';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  buildNewEventForm(): FormGroup {
    return this.fb.group({
      id: [0],
      [EVENT_FORM_KEYS.TITLE]: [
        '',
        [
          Validators.required,
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_TITLE_LENGTH),
        ],
      ],
      [EVENT_FORM_KEYS.CATEGORY]: ['', Validators.required],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH),
        ],
      ],

      schedule: this.fb.group({
        [EVENT_FORM_KEYS.SCHEDULE.DATE]: ['', Validators.required],
        [EVENT_FORM_KEYS.SCHEDULE.TIME]: ['', Validators.required],
      }),

      [EVENT_FORM_KEYS.LOCATION]: [
        '',
        [
          Validators.required,
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_LOCATION_LENGTH),
        ],
      ],
      [EVENT_FORM_KEYS.TOTAL_TICKETS]: [
        '',
        [Validators.required, Validators.min(VALIDATION_CONSTANTS.MIN_TICKETS)],
      ],
      [EVENT_FORM_KEYS.PRICE]: [
        '',
        [Validators.required, Validators.min(VALIDATION_CONSTANTS.MIN_PRICE)],
      ],
    });
  }
  loginForm(): FormGroup {
    return this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(VALIDATION_PATTERNS.EMAIL_REGEX),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH),
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH),
        ],
      ],
    });
  }

  signupForm(): FormGroup {
    return this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(VALIDATION_CONSTANTS.MIN_USERNAME_LENGTH),
            Validators.maxLength(VALIDATION_CONSTANTS.MAX_USERNAME_LENGTH),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(VALIDATION_PATTERNS.EMAIL_REGEX),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH),
            Validators.maxLength(VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: CustomValidators.passwordsMatch(),
      }
    );
  }
}
