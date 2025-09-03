import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar-component';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { selectLoginRole } from '../../../features/public/login/store/login-component.selectors';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { AuthService } from '../../../core/services/auth-service';
import { of, take } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let store: MockStore;
  let mockRoleSelector: MemoizedSelector<LoginState, string | null>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA], // skips all Angular Material components
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockRoleSelector = store.overrideSelector(selectLoginRole, 'user');

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('logout()', () => {
    it('should call AuthService.logout and navigate to /login', () => {
      component.logout();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('ngOnInit()', () => {
    it('should subscribe to role$ and log role', (done) => {
      mockRoleSelector.setResult('admin');
      store.refreshState();

      spyOn(console, 'log');

      component.ngOnInit();

      component.role$.pipe(take(1)).subscribe(() => {
        expect(console.log).toHaveBeenCalledWith('Current role:', 'admin');
        expect(console.log).toHaveBeenCalledWith('User is admin');
        done();
      });
    });
  });

  describe('dashboardRedirect()', () => {
    it('should navigate to admin dashboard for admin', () => {
      mockRoleSelector.setResult('admin');
      store.refreshState();

      component.dashboardRedirect();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should navigate to user dashboard for non-admin', () => {
      mockRoleSelector.setResult('user');
      store.refreshState();

      component.dashboardRedirect();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/dashboard']);
    });
  });

  describe('eventListRedirect()', () => {
    it('should navigate to admin event list for admin', () => {
      mockRoleSelector.setResult('admin');
      store.refreshState();

      component.eventListRedirect();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/event/list']);
    });

    it('should navigate to user event list for non-admin', () => {
      mockRoleSelector.setResult('user');
      store.refreshState();

      component.eventListRedirect();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/event/list']);
    });
  });
});
