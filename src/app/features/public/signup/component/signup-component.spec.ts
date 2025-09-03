import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup-component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SignupState } from '../store/signup-component.reducer';
import * as SignupActions from '../store/signup-component.actions';
import { FormService } from '../../../../core/services/form/form-service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let store: MockStore<{ signup: SignupState }>;
  let dispatchSpy: jasmine.Spy;

  const initialState: { signup: SignupState } = {
    signup: {
      user: null,
      token: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignupComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [FormService, provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with controls', () => {
    const controls = component.signupForm.controls;
    expect(controls['username']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['confirmPassword']).toBeDefined();
  });

  it('should validate password and confirmPassword match', () => {
    const form = component.signupForm;
    form.get('password')?.setValue('abc123');
    form.get('confirmPassword')?.setValue('xyz789');

    expect(form.valid).toBeFalse();
    expect(form.errors).toEqual({ mismatch: true });

    form.get('confirmPassword')?.setValue('abc123');
    expect(form.errors).toBeNull();
  });

  it('should dispatch signup action when form is valid', () => {
    component.signupForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'abc123',
      confirmPassword: 'abc123',
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      SignupActions.signup({
        username: 'testuser',
        email: 'test@example.com',
        password: 'abc123',
      })
    );
  });

  it('should mark all controls as touched if form is invalid', () => {
    const form = component.signupForm;
    form.get('email')?.setValue(''); // make invalid

    spyOn(form, 'markAllAsTouched');
    component.onSubmit();

    expect(form.markAllAsTouched).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should expose error$ and loading$ from store', (done) => {
    store.setState({
      signup: {
        user: null,
        token: null,
        loading: true,
        error: 'Invalid email',
      },
    });

    component.error$.subscribe((err) => {
      expect(err).toBe('Invalid email');
    });

    component.loading$.subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });
});
