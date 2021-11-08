import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ResponseInterface } from '../../../shared/interface/response/response.interface';

const BASE_URL = environment.baseUrl;
const API_BOX_PERSONALE = BASE_URL + environment.apiUrl.box.personale;

@Injectable()
export class BoxPersonaleService {

    constructor(private http: HttpClient) {
    }

    public getDataBoxPersonale(): Observable<ResponseInterface> {
        return this.http.get<ResponseInterface>(`${API_BOX_PERSONALE}`);
    }

}
