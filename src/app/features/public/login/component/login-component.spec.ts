import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login-component';
import { LoginState } from '../store/login-component.reducer';
import * as LoginActions from '../store/login-component.actions';
import { FormService } from '../../../../core/services/form/form-service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore<{ login: LoginState }>;
  let dispatchSpy: jasmine.Spy;

  const initialState: { login: LoginState } = {
    login: {
      token: null,
      role: null,
      username: null,
      email: null,
      bookings: [],
      error: null,
      loading: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [FormService, provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize loginForm with email and password controls', () => {
      expect(component.loginForm.contains('email')).toBeTrue();
      expect(component.loginForm.contains('password')).toBeTrue();
    });
  });

  describe('Password toggle', () => {
    it('should toggle showPassword boolean', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePassword();
      expect(component.showPassword).toBeTrue();
      component.togglePassword();
      expect(component.showPassword).toBeFalse();
    });
  });

  describe('Form submission', () => {
    it('should dispatch login action with role user when email is not admin@test.com', () => {
      component.loginForm.setValue({
        email: 'user@test.com',
        password: 'pass123',
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        LoginActions.login({
          username: 'user@test.com',
          password: 'pass123',
          role: 'user',
        })
      );
    });

    it('should dispatch login action with role admin when email is admin@test.com', () => {
      component.loginForm.setValue({
        email: 'admin@test.com',
        password: 'adminpass',
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        LoginActions.login({
          username: 'admin@test.com',
          password: 'adminpass',
          role: 'admin',
        })
      );
    });

    it('should mark all controls as touched if form is invalid', () => {
      const form = component.loginForm;
      form.get('email')?.setValue('');
      form.get('password')?.setValue('');

      spyOn(form, 'markAllAsTouched');
      component.onSubmit();

      expect(form.markAllAsTouched).toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Selectors', () => {
    it('should expose error$ and loading$ from store', (done) => {
      store.setState({
        login: {
          token: null,
          role: null,
          username: null,
          email: null,
          bookings: [],

          loading: false,
          error: 'Invalid credentials',
        },
      });

      component.error$.subscribe((err) => {
        expect(err).toBe('Invalid credentials');
      });

      component.loading$.subscribe((loading) => {
        expect(loading).toBeFalse();
        done();
      });
    });
  });
});
