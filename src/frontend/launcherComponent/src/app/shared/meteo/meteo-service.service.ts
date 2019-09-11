import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/internal/operators';
import { Meteo } from '../model/meteo.model';
import { Coordinate } from '../model/coordinate.model';
import { degToCompass, wipeCoordinate } from '../helper/function';
import { handleError } from '../helper/handleError';

const API_METEO = environment.apiUrl.meteo;
const CFG = {
    lang: 'it',
    key: 'a23cc450dabf63fdb6729696aa29b3a6',
    unit: 'metric'
};


@Injectable({
    providedIn: 'root'
})
export class MeteoService {

    private http: HttpClient;

    constructor(handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    getMeteoData(_coordinate: Coordinate): Observable<Meteo> {
        const API_METEO_URL = API_METEO + wipeCoordinate(_coordinate) + '&lang=' + CFG.lang + '&appid=' + CFG.key + '&units=' + CFG.unit;
        return this.http.get(API_METEO_URL).pipe(
            map((data: any) => {
                return new Meteo(
                    data.weather[0].description,
                    data.weather[0].icon,
                    data.main.humidity,
                    Math.floor(data.main['temp'] * 10) / 10,
                    Math.floor(data.wind.speed * 3.6), {
                        gradi: Math.floor(data.wind['deg']),
                        cardinali: degToCompass(Math.floor(data.wind['deg']))
                    }
                );
            }),
            retry(3),
            catchError(handleError)
        );
    }


}
