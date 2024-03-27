import { Injectable } from '@angular/core';
import { GuestModel } from '../model/guest.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private readonly BASE_URL =
    'https://invw-4c3c9-default-rtdb.europe-west1.firebasedatabase.app';
  private readonly GUESTS_ENDPOINT = '/guests.json';

  constructor(private http: HttpClient) {}

  getGuestById(id: string): Observable<GuestModel> {
    return this.http.get<GuestModel>(
      `${this.BASE_URL}${this.GUESTS_ENDPOINT}?id=${id}`
    );
  }
}
