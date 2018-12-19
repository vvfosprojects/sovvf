import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {BoxInterventi} from '../../../boxes/boxes-model/box-interventi.model';
import {BoxMezzi} from '../../../boxes/boxes-model/box-mezzi.model';
import {BoxPersonale} from '../../../boxes/boxes-model/box-personale.model';

const API_URL = environment.apiUrl.boxes.infoAggregate;

@Injectable()
export class InfoAggregateService {

    constructor(private http: HttpClient) {
    }

    /**
     * url delle api da fare...
     */

    public getInterventi(): Observable<BoxInterventi> {
        return this.http.get<BoxInterventi>(API_URL).pipe(
            retry(3),
            catchError(this.handleErrorObs)
        );
    }

    public getMezzi(): Observable<BoxMezzi> {
        return this.http.get<BoxMezzi>(API_URL).pipe(
            retry(3),
            catchError(this.handleErrorObs)
        );
    }

    public getPersonale(): Observable<BoxPersonale> {
        return this.http.get<BoxPersonale>(API_URL).pipe(
            retry(3),
            catchError(this.handleErrorObs)
        );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}
