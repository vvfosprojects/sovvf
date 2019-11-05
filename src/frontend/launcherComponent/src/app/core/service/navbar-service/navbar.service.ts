import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { AppSettings } from '../../../shared/interface/app-settings.interface';
import { Observable } from 'rxjs';

const API_URL_NAVBAR = environment.apiUrl.navbar;


@Injectable()
export class NavbarService {

    constructor(private http: HttpClient) {
    }

    getNavbar(): Observable<AppSettings> {
        return this.http.get<AppSettings>(API_URL_NAVBAR).pipe(
            map((data: any) => {
                const result = data;
                result.tipologie.map(tipologia => {
                    tipologia.codiceDescrizione = `${tipologia.descrizione} (${tipologia.codice})`;
                });
                const mapper = e => ({
                    text: e.nome,
                    value: e.codice,
                    children: e.figli.map(mapper)
                });
                result.listaSedi = {
                    text: data.listaSedi.nome,
                    value: data.listaSedi.codice,
                    children: data.listaSedi.figli.map(mapper)
                };
                return result;
            }),
            tap(data => console.log('AppSettings from Api:', data)),
            retry(3),
            catchError(handleError)
        );
    }
}
