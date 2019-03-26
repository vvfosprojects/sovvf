import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';

const API_URL_RICHIESTE = environment.apiUrl.rigaElencoRichieste;

const headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
});
const httpOptions = { headers: headers };

@Injectable()
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    // public getRichieste(idUltimaRichiesta: string): Observable<any> {
    //     return this.http.get(API_URL_RICHIESTE + '?SearchKey=' + idUltimaRichiesta + '&RichiestaSingola=false', httpOptions).pipe(
    //         map((data: any) => {
    //             return data.SintesiRichiesta;
    //         }),
    //         catchError(handleError)
    //     );
    // }

    public getRichieste(signalRConnectionId: string): Observable<any> {
        return this.http.get(API_URL_RICHIESTE).pipe(
            map((data: any) => {
                console.log(data.sintesiRichiesta);
                return data.sintesiRichiesta;
            }),
            catchError(handleError)
        );
    }

    public getRichiestaById(): Observable<any> {
        return;
    }

}
