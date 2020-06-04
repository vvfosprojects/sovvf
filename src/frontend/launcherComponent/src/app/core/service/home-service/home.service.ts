import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Welcome } from '../../../shared/interface/welcome.interface';
import { Tipologia } from '../../../shared/model/tipologia.model';

const BASE_URL = environment.baseUrl;
const API_WELCOME = BASE_URL + environment.apiUrl.welcome;

@Injectable()
export class HomeService {

    constructor(private http: HttpClient) {
    }

    getHome(): Observable<Welcome> {
        return this.http.get<Welcome>(API_WELCOME).pipe(
            map((data: Welcome) => mapAppSettings(data))
        );

        function mapAppSettings(data: Welcome): Welcome {
            data.tipologie = data.tipologie.map((tipologia: Tipologia) => {
                return {
                    ...tipologia,
                    codiceDescrizione: `${tipologia.descrizione} (${tipologia.codice})`
                };
            });
            return data;
        }
    }
}
