import { Injectable } from '@angular/core';
import { BoxPersonale } from '../../../features/home/boxes/boxes-model/box-personale.model';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.personale;

@Injectable()
export class BoxPersonaleService {

    constructor(private http: HttpClient) {
    }

    public getPersonale(signalRConnectionId: string): Observable<any> {
        return this.http.get(API_URL + `?id=${signalRConnectionId}`).pipe(
            // map((data: BoxPersonale) => data['boxPersonale']),
            retry(3),
            catchError(handleError)
        );
    }

}
