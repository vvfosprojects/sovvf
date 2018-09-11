import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoAggregatServiceFake {

  constructor() { }

    getInfoAggregate(): Observable<any> {
        return this.http.get(API_URL).pipe(
            retry(3),
            catchError(this.handleErrorObs)
        );
    }
}
