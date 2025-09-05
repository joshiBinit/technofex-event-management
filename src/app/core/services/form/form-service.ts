import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  #form?: FormGroup;

  constructor(private fb: FormBuilder) {}

  get form(): FormGroup | undefined {
    return this.#form;
  }

  set form(value: FormGroup | undefined) {
    this.#form = value;
  }

  // setForm(value: FormGroup | undefined): void {
  //   this.#form = value;
  // }

  //this.formService.setForm(new FormGroup({}));
  //this.formService.form = new FormGroup({});

  buildNewEventForm(): FormGroup {
    return this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.maxLength(30)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],

      schedule: this.fb.group({
        date: ['', Validators.required],
        time: ['', Validators.required],
      }),

      location: ['', [Validators.required, Validators.maxLength(50)]],
      totalTickets: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  loginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signupForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }
}
