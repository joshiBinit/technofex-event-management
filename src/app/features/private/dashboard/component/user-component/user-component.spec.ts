import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user-component';
import { UserService } from '../../../../../core/services/users/user-service';
import { of, Subject } from 'rxjs';
import { User } from '../../../../../shared/model/user.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userServiceMock: any;

  const mockUsers: User[] = [
    {
      username: 'Alice',
      email: 'alice@test.com',
      role: 'user',
      password: '',
    },
    {
      username: 'Bob',
      email: 'bob@test.com',
      role: 'admin',
      password: '',
    },
  ];

  beforeEach(async () => {
    userServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of(mockUsers)),
    };

    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create UserComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on ngOnInit', () => {
    component.ngOnInit();
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const completeSpy = spyOn<any>(
      component['destroy$'],
      'complete'
    ).and.callThrough();
    const nextSpy = spyOn<any>(component['destroy$'], 'next').and.callThrough();

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not break if getUsers emits empty array', () => {
    userServiceMock.getUsers.and.returnValue(of([]));
    component.ngOnInit();
    expect(component.users).toEqual([]);
  });
});
