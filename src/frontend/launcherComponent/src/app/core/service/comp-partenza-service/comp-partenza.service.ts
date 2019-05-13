import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { Store } from '@ngxs/store';
import { SignalRState } from '../../signalr/store/signalR.state';

const API_URL_PREACCOPPIATI = environment.apiUrl.composizione.preaccoppiati;
const API_URL_SQUADRE = environment.apiUrl.composizione.squadre;
const API_URL_MEZZI = environment.apiUrl.composizione.mezzi;

@Injectable()
export class CompPartenzaService {

    private connectionID: string;

    constructor(private http: HttpClient, private store: Store) {
        this.connectionID = this.store.selectSnapshot(SignalRState.connectionIdSignalR);
    }

    public getPreAccoppiati(signalRConnectionId?: string): Observable<any> {
        return this.http.get(API_URL_PREACCOPPIATI + `?id=${signalRConnectionId}`).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public getMezziComposizione(signalRConnectionId?: string): Observable<any> {
        return this.http.get(API_URL_MEZZI + `?id=${signalRConnectionId}`).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public getSquadre(signalRConnectionId?: string): Observable<any> {
        return this.http.get(API_URL_SQUADRE + `?id=${signalRConnectionId}`).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
