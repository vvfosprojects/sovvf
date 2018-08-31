import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BoxMeteoWeather} from '../boxes-model/box-meteo-weather.model';

const API_URL = 'http://api.openweathermap.org/data/2.5/weather?q=Roma&lang=it&appid=a23cc450dabf63fdb6729696aa29b3a6&units=metric';

@Injectable({
    providedIn: 'root'
})
export class BoxMeteoService {

    constructor(private http: HttpClient) {
    }

    public getMeteoData(): Observable<BoxMeteoWeather> {
        return this.http.get<BoxMeteoWeather>(API_URL).pipe(
            catchError(this.handleErrorObs)
        );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}
