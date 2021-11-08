import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { map } from 'rxjs/operators';

const BASE_URL = environment.baseUrl;
const API_TIPOLOGIE = BASE_URL + environment.apiUrl.tipologie;

@Injectable({
    providedIn: 'root'
})

export class TipologieService {

    constructor(private http: HttpClient) {
    }

    getTipologie(): Observable<Tipologia[]> {
        return this.http.get<Tipologia[]>(API_TIPOLOGIE).pipe(
            map((data: Tipologia[]) => mapAppSettings(data))
        );

        function mapAppSettings(tipologie: Tipologia[]): Tipologia[] {
            tipologie = tipologie.map((tipologia: Tipologia) => {
                return {
                    ...tipologia,
                    codiceDescrizione: `${tipologia.descrizione} (${tipologia.codice})`
                };
            });
            return tipologie;
        }
    }
}
