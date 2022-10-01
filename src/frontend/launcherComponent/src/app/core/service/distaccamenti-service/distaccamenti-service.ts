import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { map } from 'rxjs/operators';

const BASE_URL = environment.baseUrl;
const API_DISTACCAMENTI = BASE_URL + environment.apiUrl.distaccamenti;

@Injectable({
    providedIn: 'root'
})
export class DistaccamentiService {

    constructor(private http: HttpClient) {
    }

    getDistaccamenti(): Observable<Sede[]> {
        return this.http.get<Sede[]>(API_DISTACCAMENTI + '/Get').pipe(
            map(response => response.map((s: Sede): Sede => ({
                ...s,
                tipo: this.getTipoSede(s.descrizione)
            })))
        );
    }

    getSediAllerta(): Observable<Sede[]> {
        return this.http.get<Sede[]>(API_DISTACCAMENTI + '/GetSediAllerta').pipe(
            map(response => response.map((s: Sede): Sede => ({
                ...s,
                tipo: this.getTipoSede(s.descrizione)
            })))
        );
    }

    getSediTrasferimenti(): Observable<Sede[]> {
        return this.http.get<Sede[]>(API_DISTACCAMENTI + '/GetSediTrasferimenti').pipe(
            map(response => response.map((s: Sede): Sede => ({
                ...s,
                tipo: this.getTipoSede(s.descrizione)
            })))
        );
    }

    getTipoSede(descSede: string): string {
        if (!descSede) {
            return;
        }
        if (descSede.toLowerCase().indexOf('direzione') !== -1) {
            return 'direzione';
        } else if (descSede.toLowerCase().indexOf('comando') !== -1) {
            return 'comando';
        } else {
            return 'distaccamento';
        }
    }

}
