import { Injectable } from '@angular/core';
import { BoxInterventi } from '../../../features/home/boxes/boxes-model/box-interventi.model';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.infoAggregate;

@Injectable()
export class BoxRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getInterventi(): Observable<BoxInterventi> {
        return this.http.get<BoxInterventi>(API_URL).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
