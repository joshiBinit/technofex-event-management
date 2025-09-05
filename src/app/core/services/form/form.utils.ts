import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function signupForm(fb: FormBuilder): FormGroup {
  return fb.group({
    id: [0],
    title: ['', [Validators.required, Validators.maxLength(30)]],
    category: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],

    schedule: fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
    }),

    location: ['', [Validators.required, Validators.maxLength(50)]],
    totalTickets: ['', [Validators.required, Validators.min(1)]],
    price: ['', [Validators.required, Validators.min(0)]],
  });
}
