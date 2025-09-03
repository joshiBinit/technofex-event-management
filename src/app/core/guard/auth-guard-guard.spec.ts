import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthGuard } from './auth-guard-guard';
import { AuthService } from '../services/auth-service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getRole',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/dummy' } as RouterStateSnapshot;
  });

  it('should allow access to login page when not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    mockState.url = '/login';

    const result = guard.canActivate(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('should redirect logged-in admin away from login page to admin dashboard', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('admin');
    mockState.url = '/login';

    const urlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = guard.canActivate(mockRoute, mockState);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/admin/dashboard']);
    expect(result).toBe(urlTree);
  });

  it('should redirect logged-in user away from login page to user dashboard', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('user');
    mockState.url = '/login';

    const urlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = guard.canActivate(mockRoute, mockState);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/user/dashboard']);
    expect(result).toBe(urlTree);
  });

  it('should redirect unauthenticated user to login with returnUrl', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    mockState.url = '/admin/dashboard';

    const urlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = guard.canActivate(mockRoute, mockState);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/admin/dashboard' },
    });
    expect(result).toBe(urlTree);
  });

  it('should allow admin to access admin dashboard', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('admin');
    mockState.url = '/admin/dashboard';

    const result = guard.canActivate(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('should redirect user trying to access admin dashboard to user dashboard', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('user');
    mockState.url = '/admin/dashboard';

    const urlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = guard.canActivate(mockRoute, mockState);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/user/dashboard']);
    expect(result).toBe(urlTree);
  });

  it('should allow user to access user dashboard', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('user');
    mockState.url = '/user/dashboard';

    const result = guard.canActivate(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('should redirect admin trying to access user dashboard to admin dashboard', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('admin');
    mockState.url = '/user/dashboard';

    const urlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = guard.canActivate(mockRoute, mockState);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/admin/dashboard']);
    expect(result).toBe(urlTree);
  });

  it('should block access if route has role restrictions and user does not match', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('user');
    mockRoute.data = { role: ['admin'] };

    const urlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(urlTree);

    const result = guard.canActivate(mockRoute, mockState);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/user/dashboard']);
    expect(result).toBe(urlTree);
  });
});
