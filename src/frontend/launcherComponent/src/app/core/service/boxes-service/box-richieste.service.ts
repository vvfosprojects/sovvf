import { Injectable } from '@angular/core';
import { BoxInterventi } from '../../../features/home/boxes/boxes-model/box-interventi.model';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.richieste;


@Injectable()
export class BoxRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getInterventi(): Observable<BoxInterventi> {
        return this.http.get<any>(API_URL).pipe(
            map((data: BoxInterventi[]) => data['boxRichieste']),
            retry(3),
            catchError(handleError)
        );
    }

}
