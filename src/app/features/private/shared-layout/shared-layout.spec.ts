import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { SharedLayout } from './shared-layout';

describe('SharedLayout', () => {
  let component: SharedLayout;
  let fixture: ComponentFixture<SharedLayout>;
  let storeSpy: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [SharedLayout],
      providers: [{ provide: Store, useValue: storeSpy }],
      schemas: [NO_ERRORS_SCHEMA], // skips child components
    }).compileComponents();

    fixture = TestBed.createComponent(SharedLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    const sidenavSpy = jasmine.createSpyObj('MatSidenav', ['open', 'close']);
    component.sidenav = sidenavSpy;

    component.isSidebarOpen = true;
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeFalse();
    expect(sidenavSpy.close).toHaveBeenCalled();

    component.toggleSidebar();
    expect(component.isSidebarOpen).toBeTrue();
    expect(sidenavSpy.open).toHaveBeenCalled();
  });

  it('should dispatch initializeLogin if authData exists', () => {
    const authData = JSON.stringify({
      token: 't',
      role: 'user',
      username: 'u',
      email: 'e',
    });
    localStorage.setItem('authData', authData);

    component.ngOnInit();

    expect(storeSpy.dispatch).toHaveBeenCalled();
    localStorage.removeItem('authData');
  });
});
