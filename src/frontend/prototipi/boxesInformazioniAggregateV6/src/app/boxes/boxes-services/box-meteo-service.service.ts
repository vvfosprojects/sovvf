import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const API_URL = environment.apiUrl.owm.url;
const CFG = environment.apiUrl.owm.option;


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
