import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { AppSettings, AppSettingsAPI } from '../../../shared/interface/app-settings.interface';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_URL_NAVBAR = BASE_URL + environment.apiUrl.navbar;

@Injectable()
export class NavbarService {

    constructor(private http: HttpClient) {
    }

    getNavbar(): Observable<AppSettings> {
        return this.http.get<AppSettingsAPI>(API_URL_NAVBAR).pipe(
            map((data: AppSettingsAPI) => mapAppSettings(data)),
            tap(data => console.log('AppSettings from Api:', data)),
            retry(3),
            catchError(handleError)
        );

        function mapAppSettings(data: AppSettingsAPI): AppSettings {
            const result = {} as AppSettings;
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
            result.ruoliUtLoggato = data.ruoliUtLoggato;
            return result;
        }
    }
}

