import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EventBookingService } from './event-booking-service';
import { Event } from '../../../shared/model/event.model';

describe('EventBookingService', () => {
  let service: EventBookingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventBookingService],
    });

    service = TestBed.inject(EventBookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensures no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST an event', () => {
    const mockEvent: Event = {
      id: '1',
      title: 'Test Event',
      category: 'Cat',
      description: 'Desc',
      date: '2025-09-03',
      time: '10:00',
      location: 'Loc',
      totalTickets: 100,
      price: 50,
    };

    service.bookEvent(mockEvent).subscribe((res: any) => {
      expect(res).toEqual(mockEvent);
    });

    const req = httpMock.expectOne('http://localhost:3000/bookedEvents');
    expect(req.request.method).toBe('POST');
    req.flush(mockEvent); // respond with mockEvent
  });

  it('should GET booked events', () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Event 1',
        category: 'Cat',
        description: 'Desc',
        date: '2025-09-03',
        time: '10:00',
        location: 'Loc',
        totalTickets: 100,
        price: 50,
      },
    ];

    service.getBookedEvents().subscribe((res: any) => {
      expect(res).toEqual(mockEvents);
    });

    const req = httpMock.expectOne('http://localhost:3000/bookedEvents');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });
});
