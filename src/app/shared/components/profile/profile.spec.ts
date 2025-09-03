import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoginState } from '../../../features/public/login/store/login-component.reducer';
import {
  selectLoginUsername,
  selectLoginEmail,
  selectLoginRole,
} from '../../../features/public/login/store/login-component.selectors';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let store: MockStore;
  let mockUsernameSelector: any;
  let mockEmailSelector: any;
  let mockRoleSelector: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [HttpClientTestingModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    mockUsernameSelector = store.overrideSelector(selectLoginUsername, null);
    mockEmailSelector = store.overrideSelector(selectLoginEmail, null);
    mockRoleSelector = store.overrideSelector(selectLoginRole, null);

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default user before ngOnInit', (done) => {
    component.user$.pipe(take(1)).subscribe((user) => {
      expect(user.username).toBe('Guest');
      expect(user.email).toBe('guest@example.com');
      expect(user.role).toBe('user');
      expect(user.password).toBe('*****');
      done();
    });
  });

  it('should set user$ from store after ngOnInit', (done) => {
    mockUsernameSelector.setResult('TestUser');
    mockEmailSelector.setResult('test@mail.com');
    mockRoleSelector.setResult('admin');
    store.refreshState();

    component.ngOnInit();

    component.user$.pipe(take(1)).subscribe((user) => {
      expect(user.username).toBe('TestUser');
      expect(user.email).toBe('test@mail.com');
      expect(user.role).toBe('admin');
      expect(user.password).toBe('*****');
      done();
    });
  });

  it('should fallback to Guest values if selectors return null', (done) => {
    mockUsernameSelector.setResult(null);
    mockEmailSelector.setResult(null);
    mockRoleSelector.setResult(null);
    store.refreshState();

    component.ngOnInit();

    component.user$.pipe(take(1)).subscribe((user) => {
      expect(user.username).toBe('Guest');
      expect(user.email).toBe('guest@example.com');
      expect(user.role).toBe('user');
      expect(user.password).toBe('*****');
      done();
    });
  });
});
