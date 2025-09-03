import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './form-service';

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormService],
    });

    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build new event form with default values', () => {
    const form = service.buildNewEventForm();
    expect(form).toBeTruthy();
    expect(form.get('title')?.value).toBe('');
    expect(form.get('schedule.date')?.value).toBe('');
  });

  it('should mark required fields invalid when empty', () => {
    const form = service.buildNewEventForm();
    form.get('title')?.setValue('');
    form.get('category')?.setValue('');
    form.get('schedule.date')?.setValue('');
    form.get('schedule.time')?.setValue('');
    expect(form.valid).toBeFalse();
  });

  it('should build login form with email and password controls', () => {
    const form = service.loginForm();
    expect(form.get('email')).toBeTruthy();
    expect(form.get('password')).toBeTruthy();
  });

  it('should build signup form with username, email, password, and confirmPassword', () => {
    const form = service.signupForm();
    expect(form.get('username')).toBeTruthy();
    expect(form.get('email')).toBeTruthy();
    expect(form.get('password')).toBeTruthy();
    expect(form.get('confirmPassword')).toBeTruthy();
  });
});
