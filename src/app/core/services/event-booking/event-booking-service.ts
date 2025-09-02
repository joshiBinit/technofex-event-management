import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../../../shared/model/event.model';
@Injectable({
  providedIn: 'root',
})
export class EventBookingService {
  private http = inject(HttpClient);
  private bookEventUrl = 'http://localhost:3000/bookedEvents';

  bookEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.bookEventUrl, event);
  }
  getBookedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.bookEventUrl);
  }
}
