import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Sede } from '../../../shared/model/sede.model';

const API_URL_UNITA = environment.apiUrl.sedi.fake;


@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaService {

    private subjectUnitaOperative$ = new Subject<Sede[]>();

    constructor(private http: HttpClient) {
    }

    getData(): Observable<any> {
        return this.http.get(API_URL_UNITA).pipe(
            map((res: any) => {
                return res.map(data => {
                    return new Sede(
                        data.codice,
                        data.descrizione,
                        {
                            latitudine: data.Latitudine,
                            longitudine: data.Longitudine
                        },
                        data.indirizzo,
                        data.tipo,
                        data.regione,
                        data.provincia
                    );
                });
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

    getUnitaOperative(): Observable<Sede[]> {
        this.getData()
            .subscribe({
                next: data => {
                    this.subjectUnitaOperative$.next(data);
                },
                error: data => console.log(`Errore: ${data}`)
            });
        return this.subjectUnitaOperative$.asObservable();
    }

}
