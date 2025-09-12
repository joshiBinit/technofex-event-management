import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event } from '../../../shared/model/event.model';
import { Location } from '../../../shared/model/event.model';
import { environment } from '../../../../Environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private eventUrl = `${environment.apiUrl}/events`;
  private locationUrl = `${environment.apiUrl}/locations`;
  locations: string[] = [];

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventUrl, event);
  }

  getEvents(): Observable<Event[]> {
    return this.http
      .get<Event[]>(this.eventUrl)
      .pipe(map((events) => events.reverse()));
  }

  getRandomEvents(limit: number = 3): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventUrl).pipe(
      map((events) => {
        return events.sort(() => 0.5 - Math.random()).slice(0, limit);
      })
    );
  }

  loadLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationUrl);
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.eventUrl}/${id}`, event);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.eventUrl}/${id}`);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.eventUrl}/${id}`);
  }
}
