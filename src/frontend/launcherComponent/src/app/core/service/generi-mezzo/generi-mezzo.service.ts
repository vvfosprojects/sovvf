import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenereMezzo } from '../../../shared/interface/genere-mezzo.interface';

const BASE_URL = environment.baseUrl;
const API_MEZZI_IN_SERVIZIO = BASE_URL + environment.apiUrl.mezziInServizio;

@Injectable({
    providedIn: 'root'
})

export class GeneriMezzoService {

    constructor(private http: HttpClient) {
    }

    get(): Observable<GenereMezzo[]> {
        return this.http.get<GenereMezzo[]>(API_MEZZI_IN_SERVIZIO + '/GetGeneriMezzo');
    }
}
