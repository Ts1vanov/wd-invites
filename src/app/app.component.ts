import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  guests: any[] = [];
  guests$: Observable<any[]>;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.guests$ = this.route.queryParams.pipe(
      switchMap((params) =>
        this.http
          .get<any[]>(
            'https://invw-4c3c9-default-rtdb.europe-west1.firebasedatabase.app/guests.json'
          )
          .pipe(
            map((data) => {
              return Object.keys(data)
                .map((key) => {
                  const guestData = data[key as keyof typeof data];
                  let guestNames: string[];
                  if (Array.isArray(guestData.guestNames)) {
                    guestNames = guestData.guestNames;
                  } else {
                    guestNames = [guestData.guestNames];
                  }
                  return {
                    guestNames: guestNames,
                    id: guestData.id,
                    isAttending: guestData.isAttending,
                    nOfGuests: guestData.nOfGuests,
                  };
                })
                .filter((guest) => guest.id === params['id']);
            })
          )
      )
    );

    this.guests$.subscribe((guests) => {
      this.guests = guests;
    });
  }

  isAttending(id: string): void {
    this.guests = this.guests.map((guest) => {
      if (guest.id === id) {
        guest.isAttending = true;
        this.http
          .patch(
            `https://invw-4c3c9-default-rtdb.europe-west1.firebasedatabase.app/guests/${id}.json`,
            guest
          )
          .subscribe();
      }
      return guest;
    });
  }

  isNotAttending(id: string): void {
    this.guests = this.guests.map((guest) => {
      if (guest.id === id) {
        guest.isAttending = false;
        this.http
          .patch(
            `https://invw-4c3c9-default-rtdb.europe-west1.firebasedatabase.app/guests/${id}.json`,
            guest
          )
          .subscribe();
      }
      return guest;
    });
  }
}
