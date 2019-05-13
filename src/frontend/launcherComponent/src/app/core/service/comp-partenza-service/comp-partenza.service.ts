import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../shared/helper/handleError';
import { Store } from '@ngxs/store';
import { SignalRState } from '../../signalr/store/signalR.state';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { StatoSquadra } from '../../../shared/enum/stato-squadra.enum';
import { SetPreAccoppiati } from '../../../features/home/store/actions/composizione-partenza/pre-accoppiati.actions';
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../../../features/home/composizione-partenza/interface/squadra-composizione-interface';
import { SetSquadreComposizione } from '../../../features/home/store/actions/composizione-partenza/squadre-composizione.actions';

const API_URL_PREACCOPPIATI = environment.apiUrl.composizione.preaccoppiati;
const API_URL_SQUADRE = environment.apiUrl.composizione.squadre;
const API_URL_MEZZI = environment.apiUrl.composizione.mezzi;
const API_URL_FILTRI = environment.apiUrl.composizione.filtri;

@Injectable()
export class CompPartenzaService {

    private connectionID: string;


    preAccoppiati: BoxPartenza[];
    mezzi: MezzoComposizione[];
    squadre: SquadraComposizione[];

    constructor(private http: HttpClient, private store: Store) {
        this.connectionID = this.store.selectSnapshot(SignalRState.connectionIdSignalR);
    }

    public getPreAccoppiati(): Observable<any> {
        return this.http.get(API_URL_PREACCOPPIATI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public getMezziComposizione(): Observable<any> {
        return this.http.get(API_URL_MEZZI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    public getSquadre(): Observable<any> {
        return this.http.get(API_URL_SQUADRE).pipe(
            retry(3),
            catchError(handleError)
        );
    }

    // Filterbar
    getFiltri(): Observable<any> {
        return this.http.get(API_URL_FILTRI).pipe(
            retry(3),
            catchError(handleError)
        );
    }

}
