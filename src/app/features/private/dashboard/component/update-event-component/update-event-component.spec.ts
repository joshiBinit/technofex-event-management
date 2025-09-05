import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEventComponent } from './update-event-component';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject, throwError } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Event } from '../../../../../shared/model/event.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UpdateEventComponent', () => {
  let component: UpdateEventComponent;
  let fixture: ComponentFixture<UpdateEventComponent>;
  let routerMock: any;
  let routeMock: any;
  let formServiceMock: any;
  let eventServiceMock: any;
  let snackBarMock: any;

  const mockEvent: Event = {
    id: '1',
    title: 'Music Fest',
    category: 'Music',
    description: 'Awesome event',
    date: '2025-09-10',
    time: '18:00',
    location: 'Kathmandu',
    totalTickets: 100,
    price: 50,
  };

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    routeMock = {
      paramMap: of({
        get: (key: string) => (key === 'id' ? '1' : null),
      }),
    };

    formServiceMock = {
      buildNewEventForm: jasmine.createSpy('buildNewEventForm').and.returnValue(
        new FormGroup({
          title: new FormControl(''),
          category: new FormControl(''),
          description: new FormControl(''),
          schedule: new FormGroup({
            date: new FormControl(null),
            time: new FormControl(''),
          }),
          location: new FormControl(''),
          totalTickets: new FormControl(0),
          price: new FormControl(0),
        })
      ),
    };

    eventServiceMock = {
      loadLocations: jasmine
        .createSpy('loadLocations')
        .and.returnValue(of([{ name: 'Kathmandu' }])),
      getEventById: jasmine
        .createSpy('getEventById')
        .and.returnValue(of(mockEvent)),
      updateEvent: jasmine.createSpy('updateEvent').and.returnValue(of({})),
    };

    snackBarMock = {
      open: jasmine.createSpy('open'),
    };

    await TestBed.configureTestingModule({
      declarations: [UpdateEventComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: FormService, useValue: formServiceMock },
        { provide: EventService, useValue: eventServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create UpdateEventComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load locations + event on ngOnInit', () => {
    expect(formServiceMock.buildNewEventForm).toHaveBeenCalled();
    expect(eventServiceMock.loadLocations).toHaveBeenCalled();
    expect(eventServiceMock.getEventById).toHaveBeenCalledWith('1');
    expect(component.eventForm).toBeDefined();
  });

  it('should populate locations from loadLocations', () => {
    component.loadLocations();
    expect(component.locations).toEqual(['Kathmandu']);
  });

  it('should handle error in loadLocations gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    eventServiceMock.loadLocations.and.returnValue(
      throwError(() => new Error('Load fail'))
    );

    component.loadLocations();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load locations:',
      jasmine.any(Error)
    );
  });

  it('should patch form values in loadEvent and add missing location', () => {
    const newEvent: Event = { ...mockEvent, location: 'Pokhara' };
    eventServiceMock.getEventById.and.returnValue(of(newEvent));

    component.loadEvent('2');

    expect(component.eventForm.value.title).toBe('Music Fest');
    expect(component.locations.includes('Pokhara')).toBeTrue();
  });

  it('should handle error in loadEvent gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    eventServiceMock.getEventById.and.returnValue(
      throwError(() => new Error('Event fail'))
    );

    component.loadEvent('2');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load event:',
      jasmine.any(Error)
    );
  });

  it('should submit form and update event successfully', () => {
    component.eventId = '1';
    component.eventForm.setValue({
      title: 'Updated Title',
      category: 'Updated Category',
      description: 'Updated Desc',
      schedule: { date: new Date('2025-09-20'), time: '20:00' },
      location: 'Kathmandu',
      totalTickets: 150,
      price: 75,
    });

    component.onSubmit();

    expect(eventServiceMock.updateEvent).toHaveBeenCalledWith(
      '1',
      jasmine.objectContaining({
        title: 'Updated Title',
        date: '2025-09-20',
      })
    );
    expect(snackBarMock.open).toHaveBeenCalledWith(
      '✅ Event updated successfully',
      'Close',
      jasmine.objectContaining({ duration: 3000 })
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/event/list']);
  });

  it('should show error snackbar when updateEvent fails', () => {
    component.eventId = '1';
    component.eventForm.patchValue({
      title: 'Bad Event',
      schedule: { date: new Date('2025-09-20'), time: '20:00' },
    });

    eventServiceMock.updateEvent.and.returnValue(
      throwError(() => new Error('Update fail'))
    );

    component.onSubmit();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      '❌ Failed to update event. Please try again.',
      'Close',
      jasmine.objectContaining({ duration: 3000 })
    );
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
});
