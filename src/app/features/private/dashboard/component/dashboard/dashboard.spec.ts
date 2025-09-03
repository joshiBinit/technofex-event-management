import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../../core/services/auth-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { of, Subject } from 'rxjs';
import { loadEvents } from '../../../events/store/events/event.action';
import { Event } from '../../../../../shared/model/event.model';
import { User } from '../../../../../shared/model/user.model';
import { computeEventsWithBookings } from '../../utils/event-utils';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let storeMock: any;
  let authServiceMock: any;

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Event A',
      category: 'Music',
      description: '',
      location: 'Kathmandu',
      totalTickets: 100,
      price: 50,
      date: '2025-09-10',
      time: '18:00',
    },
    {
      id: '2',
      title: 'Event B',
      category: 'Tech',
      description: '',
      location: 'Pokhara',
      totalTickets: 200,
      price: 100,
      date: '2025-09-15',
      time: '10:00',
    },
  ];

  const mockUsers: User[] = [
    {
      username: 'Alice',
      email: 'a@test.com',
      role: 'user',
      password: '',
    },
    {
      username: 'Bob',
      email: 'b@test.com',
      role: 'user',
      password: '',
    },
  ];

  beforeEach(async () => {
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of(mockEvents)),
    };

    authServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of(mockUsers)),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: EventService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create DashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEvents on ngOnInit', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(loadEvents());
  });

  it('should compute eventsWithBookings from events and users', () => {
    component.ngOnInit();

    const expected = computeEventsWithBookings(mockEvents, mockUsers);
    expect(component.eventsWithBookings).toEqual(expected);

    // Example: tickets booked should be aggregated correctly
    // const event1 = component.eventsWithBookings.find((e) => e.id === '1');
    // expect(event1?.ticketsBooked).toBe(5); // 2 + 3

    // const event2 = component.eventsWithBookings.find((e) => e.id === '2');
    // expect(event2?.ticketsBooked).toBe(1);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const completeSpy = spyOn<any>(
      component['destroy$'],
      'complete'
    ).and.callThrough();
    const nextSpy = spyOn<any>(component['destroy$'], 'next').and.callThrough();

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
