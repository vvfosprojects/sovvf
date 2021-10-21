import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { ResponseInterface } from '../../../shared/interface/response/response.interface';
import { InterventiProssimitaResponse } from '../../../shared/interface/response/interventi-prossimita-response.interface';
import { CountInterventiProssimitaResponse } from '../../../shared/interface/response/count-interventi-prossimita-response.interface';
import { Sede } from '../../../shared/model/sede.model';

const BASE_URL = environment.baseUrl;
const API_CHIAMATA = BASE_URL + environment.apiUrl.chiamata;
const API_COMPETENZE = BASE_URL + environment.apiUrl.competenze;
const API_GESTIONE_RICHIESTA = BASE_URL + environment.apiUrl.gestioneRichiesta;

@Injectable()
export class ChiamataService {

    constructor(private http: HttpClient) {
    }

    public getCompetenze(coordinate: Coordinate): Observable<ResponseInterface> {
        return this.http.post<ResponseInterface>(`${API_COMPETENZE}/GetCompetenze`, coordinate);
    }

    public getCountInterventiProssimita(indirizzo: string, coordinate: Coordinate, competenze: Sede[]): Observable<CountInterventiProssimitaResponse> {
        const obj = {
            coordinate,
            indirizzo,
            competenze
        };
        return this.http.post<CountInterventiProssimitaResponse>(`${API_GESTIONE_RICHIESTA}/GetCountInterventiVicinanze`, obj);
    }

    public getInterventiProssimita(indirizzo: string, coordinate: Coordinate, competenze: Sede[]): Observable<InterventiProssimitaResponse> {
        const obj = {
            coordinate,
            indirizzo,
            competenze
        };
        return this.http.post<InterventiProssimitaResponse>(`${API_GESTIONE_RICHIESTA}/GetInterventiVicinanze`, obj);
    }

    public insertChiamata(chiamata: SintesiRichiesta): Observable<SintesiRichiesta> {
        return this.http.post<SintesiRichiesta>(`${API_CHIAMATA}/Add`, chiamata);
    }

}
