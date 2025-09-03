import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list-component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';
import * as EventsActions from '../../store/events/event.action';
import * as BookedEventsActions from '../../../events/store/booked-events/booked-events.action';
import { EventService } from '../../../../../core/services/event/event-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

xdescribe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let eventServiceSpy: jasmine.SpyObj<EventService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Concert',
      category: 'Music',
      date: '2025-01-01',
      location: 'Kathmandu',
      availableTickets: 50,
      price: 500,
      description: '',
      time: '',
      totalTickets: 0,
    },
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    eventServiceSpy = jasmine.createSpyObj('EventService', ['deleteEvent']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['addBooking']);

    await TestBed.configureTestingModule({
      declarations: [EventListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {
            events: { events: mockEvents, loading: false },
            login: { role: 'admin' },
          },
        }),
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: EventService, useValue: eventServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadEvents on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(EventsActions.loadEvents());
  });

  it('should get admin columns when role is admin', (done) => {
    component.getDisplayedColumns().subscribe((cols) => {
      expect(cols).toContain('actions');
      expect(cols).toContain('tickets');
      done();
    });
  });

  it('should navigate to add event', () => {
    component.onAddEvent();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/addevent']);
  });

  it('should navigate to update event with id', () => {
    component.onUpdateEvent('123');
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/updateevent',
      '123',
    ]);
  });

  it('should show duplicate booking snackbar', () => {
    authServiceSpy.addBooking.and.returnValue(of('duplicate'));
    component.onBookNow(mockEvents[0]);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      '❌ Concert is already booked!',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should show soldout snackbar', () => {
    authServiceSpy.addBooking.and.returnValue(of('soldout'));
    component.onBookNow(mockEvents[0]);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      '❌ Concert is sold out!',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should call deleteEvent when confirmed', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj as MatDialogRef<any, any>);
    eventServiceSpy.deleteEvent.and.returnValue(of(void 0));

    component.onDeleteEvent('1');

    expect(eventServiceSpy.deleteEvent).toHaveBeenCalledWith('1');
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      '✅ Event deleted successfully',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should not delete event when dialog not confirmed', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(false) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj as MatDialogRef<any, any>);

    component.onDeleteEvent('1');

    expect(eventServiceSpy.deleteEvent).not.toHaveBeenCalled();
  });

  it('should update displayed events on pagination change', () => {
    component.onPaginatedDataChanged(mockEvents);
    expect(component.displayedEvents).toEqual(mockEvents);
  });
});
