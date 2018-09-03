import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const API_URL = environment.apiUrl.boxes.owm.url;
const CFG = environment.apiUrl.boxes.owm.option;


@Injectable({
    providedIn: 'root'
})
export class BoxMeteoService {

    constructor(private http: HttpClient) {
    }

    public getMeteoData(_lat?, _lon?): Observable<any> {
        return this.http.get(
            API_URL + this.getLocalita(_lat, _lon)
            + '&lang=' + CFG.lang + '&appid=' + CFG.key + '&units=' + CFG.unit)
            .pipe(
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


    public getLocalita(lat?, lon?) {
        if (lat && lon) {
            lat = Math.floor(lat * 100 ) / 100;
            lon = Math.floor(lon * 100 ) / 100;
            return 'lat=' + lat + '&lon=' + lon;
        } else {
            return console.log('Errore ricezione coordinate meteo: ' + lat + ',' + lon);
        }
    }
}
