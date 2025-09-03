import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AddEventComponent } from './add-event';
import { FormService } from '../../../../../core/services/form/form-service';
import { EventService } from '../../../../../core/services/event/event-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { addEvent } from '../../store/dashboard-event/dashboard-event.action';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;
  let formServiceMock: any;
  let eventServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;
  let storeMock: any;

  beforeEach(async () => {
    formServiceMock = {
      buildNewEventForm: jasmine.createSpy('buildNewEventForm').and.returnValue(
        new FormGroup({
          title: new FormControl('Test Event'),
          category: new FormControl('Concert'),
          description: new FormControl('Event Description'),
          location: new FormControl('Kathmandu'),
          totalTickets: new FormControl(100),
          price: new FormControl(50),
          schedule: new FormGroup({
            date: new FormControl('2025-09-03'),
            time: new FormControl('18:00'),
          }),
        })
      ),
    };

    eventServiceMock = {
      loadLocations: jasmine
        .createSpy('loadLocations')
        .and.returnValue(of([{ name: 'Kathmandu' }, { name: 'Pokhara' }])),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    snackBarMock = {
      open: jasmine.createSpy('open'),
    };

    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddEventComponent],
      providers: [
        { provide: FormService, useValue: formServiceMock },
        { provide: EventService, useValue: eventServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and load locations on ngOnInit', () => {
    expect(formServiceMock.buildNewEventForm).toHaveBeenCalled();
    expect(component.eventForm).toBeDefined();
    expect(eventServiceMock.loadLocations).toHaveBeenCalled();
    expect(component.locations).toEqual(['Kathmandu', 'Pokhara']);
  });

  it('should submit the form when valid', () => {
    component.onSubmit();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      addEvent({
        event: {
          id: '10',
          title: 'Test Event',
          category: 'Music',
          description: 'Event Description',
          location: 'Kathmandu',
          totalTickets: 100,
          price: 50,
          date: '2025-09-03',
          time: '18:00',
        },
      })
    );

    expect(snackBarMock.open).toHaveBeenCalledWith(
      '✅ Event creation in progress',
      'Close',
      jasmine.objectContaining({ duration: 2000 })
    );

    expect(component.eventForm.value.title).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/event/list']);
    expect(component.nextId).toBe(11);
  });

  it('should mark all controls as touched if form is invalid', () => {
    component.eventForm.controls['title'].setValue('');
    component.onSubmit();

    expect(component.eventForm.touched).toBeTrue();
    expect(storeMock.dispatch).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should handle error when loading locations fails', () => {
    const consoleSpy = spyOn(console, 'error');
    eventServiceMock.loadLocations.and.returnValue(
      throwError(() => new Error('Failed'))
    );

    component.loadLocations();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load locations:',
      jasmine.any(Error)
    );
  });
});
