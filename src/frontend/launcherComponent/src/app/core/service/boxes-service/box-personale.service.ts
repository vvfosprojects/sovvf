import { Injectable } from '@angular/core';
import { BoxPersonale } from '../../../features/home/boxes/boxes-model/box-personale.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl.boxes.infoAggregate;

@Injectable()
export class BoxPersonaleService {

    constructor(private http: HttpClient) {
    }

    private static handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }

    public getPersonale(): Observable<BoxPersonale> {
        return this.http.get<BoxPersonale>(API_URL).pipe(
            retry(3),
            catchError(BoxPersonaleService.handleErrorObs)
        );
    }

}
