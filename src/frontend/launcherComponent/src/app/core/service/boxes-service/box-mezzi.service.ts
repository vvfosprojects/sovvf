import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { BoxMezzi } from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl.boxes.infoAggregate;

@Injectable()
export class BoxMezziService {

    constructor(private http: HttpClient) {
    }

    private static handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }

    public getMezzi(): Observable<BoxMezzi> {
        return this.http.get<BoxMezzi>(API_URL).pipe(
            retry(3),
            catchError(BoxMezziService.handleErrorObs)
        );
    }

}
