import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {InfoAggregate} from './info-aggregate.model';

const API_URL = environment.apiUrl.boxes.infoAggregateFake.pieno;

@Injectable()
export class InfoAggregateService {

    constructor(private http: HttpClient) {
    }

    public getInfoAggregate(): Observable<InfoAggregate> {
        return this.http.get<InfoAggregate>(API_URL).pipe(
            retry(3),
            catchError(this.handleErrorObs)
        );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}
