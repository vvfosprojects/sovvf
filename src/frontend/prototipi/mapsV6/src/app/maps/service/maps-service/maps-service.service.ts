import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

const API_URL = environment.apiUrl.maps.markers.fake1;

@Injectable({
    providedIn: 'root'
})
export class MapsService {

    constructor(private http: HttpClient) {
    }

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    getData(): Observable<any> {
        return this.http.get(API_URL).pipe(
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

    /* TESTING METHOD */
    setRandomMarker() {
        return;
    }

    /* TESTING METHOD */
    removeLastMarker() {
        return;
    }

    /* TESTING METHOD */
    changeMarkerColor() {
        return;
    }

    /* TESTING METHOD */
    changeMarkerSize() {
        return;
    }

    /* TESTING METHOD */
    changeMarkerAnimation() {
        return;
    }

    /* TESTING METHOD */
    removeMarker() {
        return;
    }

    /* TESTING METHOD */
    setCentroMappa() {
        return;
    }

    /* TESTING METHOD */
    getCentro(): Observable<any> {
        return this.http.get(API_URL).pipe(
            retry(3),
            catchError(this.handleError)
        );
    }

}
