import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { FiltersInterface } from '../../../shared/interface/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';

const BASE_URL = environment.baseUrl;
const API_URL_RICHIESTE = BASE_URL + environment.apiUrl.rigaElencoRichieste;
const API_CHIAMATA = BASE_URL + environment.apiUrl.chiamata;
const API_GESTIONE_RICHIESTA = BASE_URL + environment.apiUrl.gestioneRichiesta;
const API_GESTIONE_PARTENZA = BASE_URL + environment.apiUrl.gestionePartenza;

@Injectable()
export class SintesiRichiesteService {

    constructor(private http: HttpClient) {
    }

    // TODO: implementare
    public getRichieste(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
        const filtriTipologie = filters.others.filter((f: VoceFiltro) => f.descrizione !== 'Chiuse' && f.descrizione !== 'Aperte');
        const obj = {
            'page': pagination.page,
            'pageSize': pagination.pageSize || 30,
            'includiRichiesteAperte': !!(filters.others && filters.others.filter((f: VoceFiltro) => f.descrizione === 'Aperte')[0]),
            'includiRichiesteChiuse': !!(filters.others && filters.others.filter((f: VoceFiltro) => f.descrizione === 'Chiuse')[0]),
            'filtriTipologie': filtriTipologie && filtriTipologie.length > 0 ? filtriTipologie.map(f => f.codice) : null
        };
        return this.http.post(API_URL_RICHIESTE, obj);
    }

    public getRichiestaById(id: string): Observable<SintesiRichiesta> {
        return this.http.get<SintesiRichiesta>(`${API_GESTIONE_RICHIESTA}/GetRichiesta?idRichiesta=${id}`);
    }

    public patchRichiesta(richiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<any>(`${API_CHIAMATA}/UpdateIntervento`, richiesta);
    }

    public aggiornaStatoRichiesta(obj: any): Observable<any> {
        return this.http.post<any>(`${API_GESTIONE_RICHIESTA}/AggiornaStato`, obj);
    }

    public aggiornaStatoMezzo(obj: any): Observable<any> {
        return this.http.post<any>(`${API_GESTIONE_PARTENZA}/AggiornaPartenza`, obj);
    }

    public eliminaPartenzaRichiesta(obj: any): Observable<any> {
        console.log('eliminaPartenzaRichiesta', obj);
        return this.http.post<any>(`${API_GESTIONE_PARTENZA}/AnnullaPartenza`, obj);
    }
}
