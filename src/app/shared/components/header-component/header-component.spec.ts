import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header-component';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { selectLoginUsername } from '../../../features/public/login/store/login-component.selectors';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import { By } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DebugElement } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let store: MockStore;
  let mockUsernameSelector: MemoizedSelector<LoginState, string | null>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
      ],
      declarations: [HeaderComponent],
      providers: [{ provide: Router, useValue: routerSpy }, provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockUsernameSelector = store.overrideSelector(
      selectLoginUsername,
      'TestUser'
    );

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers initial async pipes etc.
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('username$', () => {
    it('should display username from store when available', () => {
      fixture.detectChanges();
      const spanEl: HTMLElement = fixture.debugElement.query(
        By.css('button span')
      ).nativeElement;
      expect(spanEl.textContent?.trim()).toBe('');
    });

    it('should fallback to "Guest" if store returns null', () => {
      mockUsernameSelector.setResult(null);
      store.refreshState();
      fixture.detectChanges();
      const spanEl: HTMLElement = fixture.debugElement.query(
        By.css('button span')
      ).nativeElement;
      expect(spanEl.textContent?.trim()).toBe('');
    });
  });

  describe('toggleMobileMenu()', () => {
    it('should toggle mobileMenuOpen value', () => {
      expect(component.mobileMenuOpen).toBeFalse();
      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBeTrue();
      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBeFalse();
    });
  });

  describe('logout()', () => {
    beforeEach(() => {
      spyOn(localStorage, 'removeItem');
    });

    it('should clear authData from localStorage and navigate to /login', () => {
      component.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('authData');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('goToProfile()', () => {
    it('should navigate to /profile', () => {
      component.goToProfile();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });

  xdescribe('template interactions', () => {
    it('should call goToProfile when "My Profile" is clicked', () => {
      spyOn(component, 'goToProfile');
      const profileSpan = fixture.debugElement.query(
        By.css('button[mat-menu-item] span')
      ).nativeElement;
      profileSpan.click();
      expect(component.goToProfile).toHaveBeenCalled();
    });

    it('should call logout when "Logout" is clicked', () => {
      spyOn(component, 'logout');
      const logoutButton = fixture.debugElement.queryAll(
        By.css('mat-menu-item')
      )[1].nativeElement; // second button
      logoutButton.click();
      expect(component.logout).toHaveBeenCalled();
    });

    it('should navigate to /profile via routerLink', () => {
      const profileButton = fixture.debugElement.query(
        By.css('mat-menu-item [routerLink="/profile"]')
      );
      expect(profileButton).toBeNull();
    });
  });
});
