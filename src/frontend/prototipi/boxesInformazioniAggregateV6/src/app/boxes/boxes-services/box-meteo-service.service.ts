import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BoxMeteoWeather} from '../boxes-model/box-meteo-weather.model';
import {environment} from '../../../environments/environment';

const lang = 'it';
const key = 'a23cc450dabf63fdb6729696aa29b3a6';
const unit = 'metric';
const API_URL = environment.apiUrl.openweathermap;


@Injectable({
    providedIn: 'root'
})
export class BoxMeteoService {

    constructor(private http: HttpClient) {
    }

    public getMeteoData(_lat?, _lon?): Observable<BoxMeteoWeather> {
        return this.http.get<BoxMeteoWeather>(
            API_URL + this.getLocalita(_lat, _lon)
            + '&lang=' + lang + '&appid=' + key + '&units=' + unit)
            .pipe(
                catchError(this.handleErrorObs)
            );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }


    public getLocalita(lat?, lon?) {
        if (lat && lon) {
            // console.log('true ' + lat + lon);
            return 'lat=' + lat + '&lon=' + lon;
        } else {
            // console.log('false ' + lat + lon);
            return 'lat=12.48&lon=41.89';
        }
    }
}
