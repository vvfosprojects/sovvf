import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ResponseInterface } from '../../../shared/interface/response/response.interface';

const BASE_URL = environment.baseUrl;
const API_BOX_RICHIESTE = BASE_URL + environment.apiUrl.box.richieste;

@Injectable()
export class BoxRichiesteService {

    constructor(private http: HttpClient) {
    }

    public getDataBoxRichieste(): Observable<ResponseInterface> {
        return this.http.get<ResponseInterface>(`${API_BOX_RICHIESTE}`);
    }

}
