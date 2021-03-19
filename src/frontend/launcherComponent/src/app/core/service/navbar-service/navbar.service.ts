import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { AppSettings, AppSettingsAPI } from '../../../shared/interface/app-settings.interface';
import { Observable } from 'rxjs';
import { SetContatoriSchedeContatto } from '../../../features/home/store/actions/schede-contatto/schede-contatto.actions';
import { Store } from '@ngxs/store';

const BASE_URL = environment.baseUrl;
const API_URL_NAVBAR = BASE_URL + environment.apiUrl.navbar;

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    constructor(private store: Store,
                private http: HttpClient) {
    }

    getNavbar(): Observable<AppSettings> {
        return this.http.get<AppSettingsAPI>(API_URL_NAVBAR).pipe(
            map((data: AppSettingsAPI) => mapAppSettings(data)),
            tap(data => {
                console.log('AppSettings from Api:', data);
                this.store.dispatch(new SetContatoriSchedeContatto(data.infoNue));
            })
        );

        function mapAppSettings(data: AppSettingsAPI): AppSettings {
            const mapper = e => ({
                text: e.nome,
                value: e.codice,
                children: e.figli.map(mapper)
            });
            return {
                ...data,
                listaSedi: {
                    text: data.listaSedi.nome,
                    value: data.listaSedi.codice,
                    children: data.listaSedi.figli.map(mapper)
                }
            };
        }
    }
}

