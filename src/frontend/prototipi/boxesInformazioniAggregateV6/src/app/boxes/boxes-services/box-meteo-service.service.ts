import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

const API_URL = 'http://api.openweathermap.org/data/2.5/weather?q=Roma&lang=it&appid=a23cc450dabf63fdb6729696aa29b3a6';

@Injectable()
export class BoxMeteoServiceService {

    constructor(private http: HttpClient) { }

    public getMeteoData(): Observable<any> {
        return this.http.get(API_URL).pipe(
            catchError(this.handleErrorObs)
        );
    }

    private handleErrorObs(error: any) {
        console.error('Si è verificato un errore', error);
        return throwError(error.message || error);
    }
}