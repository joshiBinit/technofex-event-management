import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { EventService } from '../../../../../core/services/event/event-service';
import { catchError, Observable, of } from 'rxjs';
import { Event } from '../../../../../shared/model/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventDetailResolver implements Resolve<Event | null> {
  constructor(private eventService: EventService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Event | null> {
    const id = route.paramMap.get('id');
    if (!id) return of(null);
    return this.eventService.getEventById(id).pipe(catchError(() => of(null)));
  }
}
