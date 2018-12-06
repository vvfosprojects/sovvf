import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL_PREACCOPPIATI = environment.apiUrl.rigaElencoRichieste.fake;
const API_URL_SQUADRE = environment.apiUrl.rigaElencoRichieste.fake;
const API_URL_MEZZI = environment.apiUrl.rigaElencoRichieste.fake;

@Injectable({
  providedIn: 'root'
})
export class CompPartenzaService {

  constructor(private http: HttpClient) { }
  
  public getPreAccoppiati(): Observable<any> {
    return this.http.get(API_URL_PREACCOPPIATI).pipe(
        map((data: any) => {
            const preAccoppiati = data.SintesiRichiesta;
            return preAccoppiati;
        }),
        retry(3),
        catchError(this.handleError)
    );
}

public getMezziComposizione(): Observable<any> {
    return this.http.get(API_URL_MEZZI).pipe(
        map((data: any) => {
            const mezzi = data.Mezzi;
            return mezzi;
        }),
        retry(3),
        catchError(this.handleError)
    );
}

public getSquadre(): Observable<any> {
    return this.http.get(API_URL_SQUADRE).pipe(
        map((data: any) => {
            const squadre = data.Squadre;
            return squadre;
        }),
        retry(3),
        catchError(this.handleError)
    );
}

private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        console.error('Si è verificato un errore:', error.message);
    } else {
        console.error(
            `Errore response: ${error.status}, ` +
            `Messaggio body: ${error.message}`);
    }
    return throwError(
        'API Richieste: Qualcosa è andato storto, per favore riprova più tardi.');
}
}
