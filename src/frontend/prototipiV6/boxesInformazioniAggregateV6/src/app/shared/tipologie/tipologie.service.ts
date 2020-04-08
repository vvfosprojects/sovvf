import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tipologia } from '../model/tipologia.model';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = environment.apiUrl.elencoTipologie;
@Injectable({
  providedIn: 'root'
})
export class TipologieService {
  tipologie: Tipologia[] = [];

  constructor(private http: HttpClient) { }

  getTipologie(): Observable<any> {
    return this.http.get(API_URL).pipe(
      catchError(this.handleErrorObs)
    );
  }

  private handleErrorObs(error: any) {
    console.error('Si è verificato un errore', error);
    return throwError(error.message || error);
  }
}
