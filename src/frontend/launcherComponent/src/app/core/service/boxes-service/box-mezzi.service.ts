import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxMezzi } from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL = environment.apiUrl.boxes.infoAggregate;

@Injectable()
export class BoxMezziService {

    constructor(private http: HttpClient) {
    }


    public getMezzi(): Observable<BoxMezzi> {
        return this.http.get<BoxMezzi>(API_URL).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
