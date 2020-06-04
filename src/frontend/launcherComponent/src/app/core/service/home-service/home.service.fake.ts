import { Injectable } from '@angular/core';
import { Welcome } from '../../../shared/interface/welcome.interface';
import { map } from 'rxjs/operators';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { HttpClient } from '@angular/common/http';

const API_WELCOME = 'assets/json-fake/welcome.json';


@Injectable()
export class HomeServiceFake {

    constructor(private http: HttpClient) {
    }

    getHome() {
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
