import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event } from '../../../../shared/model/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3000/events';
  constructor(private httpClient: HttpClient) {}
  getRandomEvents(limit: number = 3): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.apiUrl).pipe(
      map((events) => {
        return events.sort(() => 0.5 - Math.random()).slice(0, limit);
      })
    );
  }
}
