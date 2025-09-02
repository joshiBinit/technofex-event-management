import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event } from '../../../shared/model/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/events'; // ✅ Your json-server endpoint

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getRandomEvents(limit: number = 3): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map((events) => {
        return events.sort(() => 0.5 - Math.random()).slice(0, limit);
      })
    );
  }
}
