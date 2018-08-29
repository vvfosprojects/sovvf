import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

const API_URL = 'https://api.myjson.com/bins/1f5pvk';


@Injectable({
    providedIn: 'root'
})
export class MapsService {
    constructor(private http: HttpClient) {
    }

    getData(): Observable<any> {
        return this.http.get(API_URL).pipe(
            catchError(this.handleErrorObs)
        );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}
