import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_TIPOLOGIE, TipologieInterface } from '../settings/tipologie';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl.elencoTipologie;

@Injectable()
export class AppLoadService {

    constructor(private http: HttpClient) {
    }

    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
            // console.log(`initializeApp:: inside promise`);
            setTimeout(() => {
                // console.log(`initializeApp:: inside setTimeout`);
                resolve();
            }, 1000);
        });
    }

    getSettings(): Promise<any> {
        return this.http.get<TipologieInterface[]>(API_URL)
            .toPromise()
            .then(settings => {
                APP_TIPOLOGIE.push(...settings);
                // console.log(`Settings from API: `, APP_TIPOLOGIE);
                return settings;
            }).catch( );
    }
}
