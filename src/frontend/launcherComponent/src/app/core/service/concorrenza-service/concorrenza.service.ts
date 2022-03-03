import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AddConcorrenzaDtoInterface } from '../../../shared/interface/dto/concorrenza/add-concorrenza-dto.interface';
import { ConcorrenzaInterface } from '../../../shared/interface/concorrenza.interface';
import { GetAllResponseInterface } from '../../../shared/interface/response/concorrenza/get-all-response.interface';

const BASE_URL = environment.baseUrl;
const API_CONCORRENZA = BASE_URL + environment.apiUrl.concorrenza;

@Injectable({
    providedIn: 'root'
})
export class ConcorrenzaService {

    constructor(private http: HttpClient) {
    }

    get(): Observable<GetAllResponseInterface> {
        return this.http.get<GetAllResponseInterface>(API_CONCORRENZA + '/GetAll');
    }

    add(data: AddConcorrenzaDtoInterface[]): Observable<ConcorrenzaInterface> {
        return this.http.post<ConcorrenzaInterface>(API_CONCORRENZA + '/Add', data);
    }

    delete(idConcorrenza: string): Observable<any> {
        return this.http.post<any>(API_CONCORRENZA + '/Delete', { id: idConcorrenza });
    }

    deleteAll(): Observable<any> {
        return this.http.post<any>(API_CONCORRENZA + '/DeleteAll', {});
    }
}
