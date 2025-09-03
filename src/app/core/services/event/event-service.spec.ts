import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { EventService } from './event-service';
import { Event } from '../../../shared/model/event.model';
describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService],
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('it should add an event', () => {
    const mockEvent: Event = {
      id: '1',
      title: 'Title test',
      category: 'Technology',
      description: 'A conference about the latest in tech.',
      date: '2025-09-10',
      time: '10:00',
      location: 'Kathmandu',
      totalTickets: 100,
      availableTickets: 75,
      price: 50,
    };

    service.addEvent(mockEvent).subscribe((res) => {
      expect(res).toEqual(mockEvent);
    });
    const req = httpMock.expectOne('http://localhost:3000/events');
    expect(req.request.method).toBe('POST');
    req.flush(mockEvent);
  });

  it('should get all events', () => {
    const mockEvent: Event[] = [
      {
        id: '1',
        title: 'Title test',
        category: 'Technology',
        description: 'A conference about the latest in tech.',
        date: '2025-09-10',
        time: '10:00',
        location: 'Kathmandu',
        totalTickets: 100,
        availableTickets: 75,
        price: 50,
      },
      {
        id: '2',
        title: 'Title test 2',
        category: 'electronics',
        description: 'A conference about the latest in tech.',
        date: '2025-09-10',
        time: '10:00',
        location: 'Kathmandu',
        totalTickets: 100,
        availableTickets: 75,
        price: 50,
      },
    ];

    service.getEvents().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res).toEqual(mockEvent);
    });
    const req = httpMock.expectOne('http://localhost:3000/events');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('should grt random event', () => {
    const mockEvent: Event[] = [
      {
        id: '1',
        title: 'Title test',
        category: 'Technology',
        description: 'A conference about the latest in tech.',
        date: '2025-09-10',
        time: '10:00',
        location: 'Kathmandu',
        totalTickets: 100,
        availableTickets: 75,
        price: 50,
      },
      {
        id: '2',
        title: 'Title test 2',
        category: 'electronics',
        description: 'A conference about the latest in tech.',
        date: '2025-09-10',
        time: '10:00',
        location: 'Kathmandu',
        totalTickets: 100,
        availableTickets: 75,
        price: 50,
      },
    ];

    service.getRandomEvents(2).subscribe((res) => {
      expect(res.length).toBe(2);
      res.forEach((res) => expect(mockEvent).toContain(res));
    });
    const req = httpMock.expectOne('http://localhost:3000/events');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('should load locations', () => {
    const mockLocations = ['Kathmandu', 'Pokhara'];
    service.loadLocations().subscribe((res) => {
      expect(res).toEqual(mockLocations);
    });
    const req = httpMock.expectOne('http://localhost:3000/locations');
    expect(req.request.method).toBe('GET');
    req.flush(mockLocations);
  });

  it('it should update an event', () => {
    const mockEvent: Event = {
      id: '2',
      title: 'updated event',
      category: 'electronics',
      description: 'A conference about the latest in tech.',
      date: '2025-09-10',
      time: '10:00',
      location: 'Kathmandu',
      totalTickets: 100,
      availableTickets: 75,
      price: 50,
    };

    service.updateEvent('2', mockEvent).subscribe((res) => {
      expect(res).toEqual(mockEvent);
    });
    const req = httpMock.expectOne('http://localhost:3000/events/2');
    expect(req.request.method).toBe('PUT');
    req.flush(mockEvent);
  });

  it('should get event by id ', () => {
    const mockEvent: Event = {
      id: '2',
      title: 'updated event',
      category: 'electronics',
      description: 'A conference about the latest in tech.',
      date: '2025-09-10',
      time: '10:00',
      location: 'Kathmandu',
      totalTickets: 100,
      availableTickets: 75,
      price: 50,
    };

    service.getEventById('1').subscribe((res) => {
      expect(res).toEqual(mockEvent);
    });
    const req = httpMock.expectOne('http://localhost:3000/events/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('should delete event by id', () => {
    service.deleteEvent('1').subscribe((res) => {
      expect(res).toBeNull();
    });
    const req = httpMock.expectOne('http://localhost:3000/events/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
