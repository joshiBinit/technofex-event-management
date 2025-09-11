import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  VALIDATION_CONSTANTS,
  VALIDATION_PATTERNS,
} from '../../constants/validation.constant';
import { CustomValidators } from '../../validators/custom-validators';
import { EVENT_FORM_KEYS } from '../../../features/private/dashboard/constants/event-form-keys.constant';
import { AUTH_FORM_KEYS } from '../../../features/public/constant/auth-form-keys.constant';

const { EMAIL, PASSWORD, USERNAME, CONFIRM_PASSWORD } = AUTH_FORM_KEYS;
const {
  TITLE,
  CATEGORY,
  DESCRIPTION,
  SCHEDULE,
  LOCATION,
  TOTAL_TICKETS,
  PRICE,
} = EVENT_FORM_KEYS;
@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  buildNewEventForm(): FormGroup {
    return this.fb.group({
      id: [0],
      [TITLE]: [
        '',
        [
          Validators.required,
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_TITLE_LENGTH),
        ],
      ],
      [CATEGORY]: ['', Validators.required],
      [DESCRIPTION]: [
        '',
        [
          Validators.required,
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH),
        ],
      ],

      schedule: this.fb.group({
        [SCHEDULE.DATE]: ['', Validators.required],
        [SCHEDULE.TIME]: ['', Validators.required],
      }),

      [LOCATION]: [
        '',
        [
          Validators.required,
          Validators.maxLength(VALIDATION_CONSTANTS.MAX_LOCATION_LENGTH),
        ],
      ],
      [TOTAL_TICKETS]: [
        '',
        [Validators.required, Validators.min(VALIDATION_CONSTANTS.MIN_TICKETS)],
      ],
      [PRICE]: [
        '',
        [Validators.required, Validators.min(VALIDATION_CONSTANTS.MIN_PRICE)],
      ],
    });
  }

  loginForm(): FormGroup {
    return this.fb.group({
      [EMAIL]: [
        '',
        [
          Validators.required,
          Validators.pattern(VALIDATION_PATTERNS.EMAIL_REGEX),
        ],
      ],
      [PASSWORD]: [
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
        [USERNAME]: [
          '',
          [
            Validators.required,
            Validators.minLength(VALIDATION_CONSTANTS.MIN_USERNAME_LENGTH),
            Validators.maxLength(VALIDATION_CONSTANTS.MAX_USERNAME_LENGTH),
          ],
        ],
        [EMAIL]: [
          '',
          [
            Validators.required,
            Validators.pattern(VALIDATION_PATTERNS.EMAIL_REGEX),
          ],
        ],
        [PASSWORD]: [
          '',
          [
            Validators.required,
            Validators.minLength(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH),
            Validators.maxLength(VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH),
          ],
        ],
        [CONFIRM_PASSWORD]: ['', Validators.required],
      },
      {
        validators: CustomValidators.passwordsMatch(),
      }
    );
  }
}
