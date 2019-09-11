import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Welcome } from '../../../shared/interface/welcome.interface';

const API_WELCOME = environment.apiUrl.welcome;

@Injectable()
export class HomeService {

  constructor(private http: HttpClient) { }

  getHome(): Observable<Welcome> {
    return this.http.get<Welcome>(API_WELCOME).pipe(
        retry(3),
        catchError(handleError)
    );
  }
}
