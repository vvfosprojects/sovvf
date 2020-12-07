import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { ResponseInterface } from '../../../shared/interface/response.interface';

const BASE_URL = environment.baseUrl;
const API_CHIAMATA = BASE_URL + environment.apiUrl.chiamata;
const API_COMPETENZE = BASE_URL + environment.apiUrl.competenze;

@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public getCompetenze(coordinate: Coordinate): Observable<ResponseInterface> {
        const obj = {
            coordinate
        };
        return this.http.post<ResponseInterface>(`${API_COMPETENZE}/GetCompetenze`, obj);
    }

    public insertChiamata(chiamata: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(`${API_CHIAMATA}/Add`, chiamata);
    }

}
