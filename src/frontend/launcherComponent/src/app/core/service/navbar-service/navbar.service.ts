import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, map, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { AppSettings } from '../../../shared/interface/app-settings.interface';
import { Observable } from 'rxjs';

const API_URL_NAVBAR = environment.apiUrl.navbar;


@Injectable()
export class NavbarService {

    constructor(private http: HttpClient) {
    }

    getNavbar(): Observable<any> {
        return this.http.get<AppSettings>(API_URL_NAVBAR).pipe(
            map( data => {
                data.tipologie.map( tipologia => {
                    tipologia.codiceDescrizione = `${tipologia.descrizione} (${tipologia.codice})`;
                });
            }),
            retry(3),
            catchError(handleError)
        );
    }
}
