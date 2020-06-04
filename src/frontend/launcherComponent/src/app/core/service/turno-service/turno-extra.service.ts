import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.baseUrl;
const API_URL_TURNO = BASE_URL + environment.apiUrl.turno;

@Injectable({
    providedIn: 'root'
})
export class TurnoExtraService {

    constructor(private http: HttpClient) {
    }

    getTurni(): Observable<any> {
        return this.http.get(API_URL_TURNO).pipe(
            map((data: any) => {
                return data;
            })
        );
    }

}
