import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/model/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../Environments/environment';
import { ApiService } from '@event-management/event-library';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private libApiService: ApiService) {}

  private get userUrl(): string {
    return this.libApiService.getUrl('users');
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }
}
