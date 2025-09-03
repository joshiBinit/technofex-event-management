import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookingDetailComponent } from './booking-detail-component';
import { BookedEventsState } from '../../../events/store/booked-events/booked-events.reducer';
import { loadBookedEvents } from '../../../events/store/booked-events/booked-events.action';
import { Event } from '../../../../../shared/model/event.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('BookingDetailComponent', () => {
  let component: BookingDetailComponent;
  let fixture: ComponentFixture<BookingDetailComponent>;
  let store: MockStore<BookedEventsState>;

  const mockEvent: Event = {
    id: '1',
    title: 'Mock Event',
    category: 'Tech',
    description: 'Mock description',
    date: '2025-09-03',
    time: '10:00',
    location: 'Kathmandu',
    totalTickets: 100,
    availableTickets: 50,
    price: 200,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingDetailComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {
            bookedEvents: [mockEvent],
          } as unknown as BookedEventsState,
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (key: string) => (key === 'id' ? '1' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadBookedEvents on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadBookedEvents());
  });
});
