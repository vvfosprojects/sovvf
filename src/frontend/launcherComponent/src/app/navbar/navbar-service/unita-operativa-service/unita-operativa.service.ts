import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const API_URL_UNITA = environment.apiUrl.maps.markers.sedi;


@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaService {

    constructor(private http: HttpClient) {
    }

    getUnitaOperative(): Observable<any> {
        return this.http.get(API_URL_UNITA).pipe(
            map((data: any) => {
                const unitaOperative = data;
                return unitaOperative;
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
            'API UnitaOperative: qualcosa è andato storto, per favore riprova più tardi.');
    }

}
