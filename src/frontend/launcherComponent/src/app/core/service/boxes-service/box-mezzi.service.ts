import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxMezzi } from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.mezzi;

@Injectable()
export class BoxMezziService {

    constructor(private http: HttpClient) {
    }


    public getMezzi(): Observable<BoxMezzi> {
        return this.http.get<any>(API_URL).pipe(
            map((data: BoxMezzi) => data['boxMezzi']),
            retry(3),
            catchError(handleError)
        );
    }

}
