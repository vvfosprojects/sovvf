import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ResponseInterface } from '../../../shared/interface/response/response.interface';

const BASE_URL = environment.baseUrl;
const API_BOX_MEZZI = BASE_URL + environment.apiUrl.box.mezzi;

@Injectable()
export class BoxMezziService {

    constructor(private http: HttpClient) {
    }

    public getDataBoxMezzi(): Observable<ResponseInterface> {
        return this.http.get<ResponseInterface>(`${API_BOX_MEZZI}`);
    }

}
