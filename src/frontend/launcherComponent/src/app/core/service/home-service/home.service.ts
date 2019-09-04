import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Welcome } from '../../../shared/interface/welcome.interface';

const API_URL_HOME = environment.apiUrl.home;

@Injectable()
export class HomeService {

  constructor(private http: HttpClient) { }

  getHome(): Observable<Welcome> {
    return this.http.get<Welcome>(API_URL_HOME).pipe(
        retry(3),
        catchError(handleError)
    );
  }
}
