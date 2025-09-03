import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDashboardComponent } from './user-dashboard-component';
import { EventService } from '../../../../../core/services/event/event-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';
import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let eventServiceMock: any;
  let authServiceMock: any;
  let snackBarMock: any;
  let storeMock: any;

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Concert',
      category: 'Music',
      date: '2025-01-01',
      time: '18:00',
      totalTickets: 100,
      availableTickets: 50,
      price: 500,
      description: '',
      location: '',
    },
  ];

  const currentUser = {
    id: 'u1',
    username: 'Alice',
    bookings: [...mockEvents],
  };

  beforeEach(async () => {
    eventServiceMock = {
      getRandomEvents: jasmine
        .createSpy('getRandomEvents')
        .and.returnValue(of(mockEvents)),
      getEventById: jasmine
        .createSpy('getEventById')
        .and.returnValue(of(mockEvents[0])),
      updateEvent: jasmine.createSpy('updateEvent').and.returnValue(of({})),
    };

    authServiceMock = {
      getCurrentUser: jasmine
        .createSpy('getCurrentUser')
        .and.returnValue(currentUser),
      addBooking: jasmine.createSpy('addBooking').and.callFake((event) => {
        currentUser.bookings.push(event);
      }),
      removeBooking: jasmine.createSpy('removeBooking').and.callFake((id) => {
        currentUser.bookings = currentUser.bookings.filter((b) => b.id !== id);
      }),
    };

    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeMock.select.and.returnValue(of(mockEvents));

    await TestBed.configureTestingModule({
      declarations: [UserDashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch random events and load booked events on init', () => {
    component.ngOnInit();

    expect(eventServiceMock.getRandomEvents).toHaveBeenCalledWith(3);
    expect(component.events).toEqual(mockEvents);
    expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    expect(component.bookedEvents).toEqual(currentUser.bookings);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      BookedEventsActions.loadBookedEvents()
    );
  });

  it('should book an event successfully', () => {
    const newEvent: Event = { ...mockEvents[0], id: '2', title: 'New Event' };

    component.onBookNow(newEvent);

    expect(authServiceMock.addBooking).toHaveBeenCalledWith(newEvent);
    expect(component.bookedEvents).toContain(newEvent);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      BookedEventsActions.bookEvent({ event: newEvent })
    );
    expect(snackBarMock.open).toHaveBeenCalledWith(
      `✅ ${newEvent.title} added successfully`,
      'Close',
      jasmine.objectContaining({ duration: 3000 })
    );
  });

  it('should cancel a booking successfully', () => {
    component.onCancelBooking('1');

    expect(authServiceMock.removeBooking).toHaveBeenCalledWith('1');
    expect(component.bookedEvents.find((b) => b.id === '1')).toBeUndefined();
    expect(eventServiceMock.getEventById).toHaveBeenCalledWith('1');
    expect(eventServiceMock.updateEvent).toHaveBeenCalled();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      `✅ Booking cancelled and tickets updated for ${mockEvents[0].title}`,
      'Close',
      jasmine.objectContaining({ duration: 3000 })
    );
  });

  it('should show error snackbar if updateEvent fails during cancel', () => {
    eventServiceMock.updateEvent.and.returnValue(
      throwError(() => new Error('Update fail'))
    );
    component.onCancelBooking('1');

    expect(snackBarMock.open).toHaveBeenCalledWith(
      `❌ Failed to update tickets for ${mockEvents[0].title}`,
      'Close',
      jasmine.objectContaining({ duration: 3000 })
    );
  });

  it('should handle error when getEventById fails during cancel', () => {
    eventServiceMock.getEventById.and.returnValue(
      throwError(() => new Error('Fetch fail'))
    );
    const consoleSpy = spyOn(console, 'error');

    component.onCancelBooking('1');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch event:',
      jasmine.any(Error)
    );
  });
});
