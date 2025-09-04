import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event } from '../../../shared/model/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/events';
  locations: string[] = [];

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  getEvents(): Observable<Event[]> {
    return this.http
      .get<Event[]>(this.apiUrl)
      .pipe(map((events) => events.reverse()));
  }

  getRandomEvents(limit: number = 3): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      map((events) => {
        return events.sort(() => 0.5 - Math.random()).slice(0, limit);
      })
    );
  }

  loadLocations(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/locations');
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
