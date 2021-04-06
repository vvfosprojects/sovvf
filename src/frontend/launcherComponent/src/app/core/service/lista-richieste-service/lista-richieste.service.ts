import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { FiltersInterface } from '../../../shared/interface/filters/filters.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';
import { Store } from '@ngxs/store';
import { ZoneEmergenzaState } from '../../../features/home/store/states/filterbar/zone-emergenza.state';
import { RichiestaActionInterface } from '../../../shared/interface/richiesta-action.interface';

const BASE_URL = environment.baseUrl;
const API_URL_RICHIESTE = BASE_URL + environment.apiUrl.rigaElencoRichieste;
const API_CHIAMATA = BASE_URL + environment.apiUrl.chiamata;
const API_GESTIONE_RICHIESTA = BASE_URL + environment.apiUrl.gestioneRichiesta;
const API_GESTIONE_PARTENZA = BASE_URL + environment.apiUrl.gestionePartenza;
const API_GESTIONE_FONOGRAMMA = BASE_URL + environment.apiUrl.gestioneFonogramma;

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteService {

    constructor(private http: HttpClient, private store: Store) {
    }

    public getRichieste(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
        const filtriTipologieRichiesta = filters.others.filter((f: VoceFiltro) => f.categoria !== 'StatiRichiesta' && f.categoria !== 'AltriFiltri' && f.categoria !== 'Chiuse');
        let filtriTipologia;
        if (filtriTipologieRichiesta?.length) {
            filtriTipologia = filtriTipologieRichiesta[0]?.codice;
        }
        const filtroStato = this.store.selectSnapshot(ZoneEmergenzaState.fakeStatoRichiesta);
        const zoneEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.zoneEmergenzaSelezionate);
        const chiuse = this.store.selectSnapshot(ZoneEmergenzaState.chiuse);
        const periodoChiuseChiamate = this.store.selectSnapshot(ZoneEmergenzaState.periodoChiuseChiamate);
        const periodoChiusiInterventi = this.store.selectSnapshot(ZoneEmergenzaState.periodoChiusiInterventi);
        const obj = {
            page: pagination.page,
            pageSize: pagination.pageSize || 30,
            includiRichiesteAperte: !!(filters.others && filters.others.filter((f: VoceFiltro) => f.descrizione === 'Aperte')[0]),
            includiRichiesteChiuse: !!(filters.others && filters.others.filter((f: VoceFiltro) => f.descrizione === 'Chiuse')[0]),
            filtriTipologie: null,
            statiRichiesta: filtroStato && filtroStato.length ? filtroStato : null,
            tipologiaRichiesta: filtriTipologia ? filtriTipologia : null,
            zoneEmergenza: zoneEmergenza && zoneEmergenza.length ? zoneEmergenza : null,
            chiuse: chiuse && chiuse.length ? chiuse : null,
            periodoChiuseChiamate: periodoChiuseChiamate.da || periodoChiuseChiamate.data || periodoChiuseChiamate.turno ? periodoChiuseChiamate : null,
            periodoChiusiInterventi: periodoChiusiInterventi.da || periodoChiusiInterventi.data || periodoChiusiInterventi.turno ? periodoChiusiInterventi : null,
        };
        return this.http.post(API_URL_RICHIESTE, obj);
    }

    public getRichiestaById(id: string): Observable<SintesiRichiesta> {
        return this.http.get<SintesiRichiesta>(`${API_GESTIONE_RICHIESTA}/GetRichiesta?idRichiesta=${id}`);
    }

    public patchRichiesta(richiesta: SintesiRichiesta): Observable<any> {
        return this.http.post<any>(`${API_CHIAMATA}/UpdateIntervento`, richiesta);
    }

    public aggiornaStatoRichiesta(obj: RichiestaActionInterface): Observable<any> {
        return this.http.post<any>(`${API_GESTIONE_RICHIESTA}/AggiornaStato`, obj);
    }

    public getCodiciRichieste(idRichiesta: string): Observable<{ listaCodiciRichiesta: string[] }> {
        console.log('getCodiciRichieste', idRichiesta);
        return this.http.get<{ listaCodiciRichiesta: string[] }>(`${API_GESTIONE_RICHIESTA}/GetCodiciRichieste?idRichiesta=` + idRichiesta);
    }

    public aggiornaStatoMezzo(obj: any): Observable<any> {
        console.log('SERVICE AggiornaStatoMezzo', obj);
        return this.http.post<any>(`${API_GESTIONE_PARTENZA}/AggiornaPartenza`, obj);
    }

    public eliminaPartenzaRichiesta(obj: any): Observable<any> {
        console.log('eliminaPartenzaRichiesta', obj);
        return this.http.post<any>(`${API_GESTIONE_PARTENZA}/AnnullaPartenza`, obj);
    }

    public modificaStatoFonogrammaRichiesta(obj: any): Observable<any> {
        console.log('modificaStatoFonogrammaRichiesta', obj);
        return this.http.post<any>(`${API_GESTIONE_FONOGRAMMA}/InfoFonogramma`, obj);
    }

    public allertaSede(obj: any): Observable<any> {
        console.log('allertaSede', obj);
        return this.http.post<any>(`${API_GESTIONE_RICHIESTA}/AllertaAltreSedi`, obj);
    }
}
