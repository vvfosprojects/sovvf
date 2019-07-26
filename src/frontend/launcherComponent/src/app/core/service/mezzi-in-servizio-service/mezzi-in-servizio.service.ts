import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { handleError } from 'src/app/shared/helper/handleError';

const API_URL_MEZZI_IN_SERVIZIO = environment.apiUrl.mezziInServizio.listaMezzi;

@Injectable({
  providedIn: 'root'
})
export class MezziInServizioService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public getMezziInServizio(): Observable<any> {
    return this.http.get(API_URL_MEZZI_IN_SERVIZIO, { 'headers': this.headers }).pipe(
      retry(3),
      catchError(handleError));
  }
}
