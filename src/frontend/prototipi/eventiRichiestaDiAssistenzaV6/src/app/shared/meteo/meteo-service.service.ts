import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/internal/operators';
import {Meteo} from '../model/meteo.model';

const API_URL = environment.apiUrl.boxes.owm.url;
const CFG = environment.apiUrl.boxes.owm.option;


@Injectable({
    providedIn: 'root'
})
export class MeteoService {

    constructor(private http: HttpClient) {
    }

    getMeteoData(_coordinate: Array<number>): Observable<any> {
        return this.http.get(
            API_URL + this.wipeCoordinate(_coordinate)
            + '&lang=' + CFG.lang + '&appid=' + CFG.key + '&units=' + CFG.unit)
            .pipe(
                map((data: any) => {
                    return new Meteo(
                        data.weather[0].description,
                        data.weather[0].icon,
                        data.main.humidity,
                        Math.floor(data.main['temp'] * 10) / 10,
                        Math.floor(data.wind.speed * 3.6), {
                            gradi: Math.floor(data.wind['deg']),
                            cardinali: this.degToCompass(Math.floor(data.wind['deg']))
                        }
                    );
                }),
                retry(3),
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('Si è verificato un errore:', error.error.message);
        } else {
            console.error(
                `Errore response: ${error.status}, ` +
                `Messaggio body: ${error.error.message}`);
        }
        return throwError(
            'Qualcosa è andato storto, per favore riprova più tardi.');
    }


    private wipeCoordinate(coordinate?: Array<number>) {
        if (coordinate.length === 2) {
            return 'lat=' + Math.floor(coordinate[0] * 100) / 100 + '&lon=' + Math.floor(coordinate[1] * 100) / 100;
        } else {
            return console.error('Errore ricezione coordinate meteo: ', coordinate);
        }
    }

    private degToCompass(num: number) {
        const val = Math.floor((num / 22.5) + 0.5);
        const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return arr[(val % 16)];
    }
}
