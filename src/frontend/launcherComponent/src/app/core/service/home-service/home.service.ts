import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL_HOME = environment.apiUrl.turno;

@Injectable()
export class HomeService {

  constructor(private http: HttpClient) { }

  getHome(): Observable<any> {
    return this.http.get(API_URL_HOME).pipe(
        retry(3),
        catchError(handleError)
    );
  }
}
