import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { handleError } from '../../../../shared/helper/handleError';

const API_URL_RICHIESTE = environment.apiUrl.maps.markers.richieste;
const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable()
export class RichiesteMarkerService {


    constructor(private http: HttpClient) {
    }

    public getRichiesteMarkers(): Observable<any> {
        return this.http.get(API_URL_RICHIESTE, httpOptions).pipe(
            map((data: any) => {
                console.log('Service Marker Richieste: ', data.SintesiRichiestaMarker);
                return data.SintesiRichiestaMarker;
            }),
            retry(3),
            catchError(handleError)
        );
    }

}
