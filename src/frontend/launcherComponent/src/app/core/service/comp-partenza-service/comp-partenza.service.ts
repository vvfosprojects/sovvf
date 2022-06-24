import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MezziComposizioneAvanzata, SquadreComposizioneAvanzata } from '../../../shared/interface/lista-composizione-avanzata-interface';
import { ConfermaPartenze } from '../../../features/home/composizione-partenza/interface/conferma-partenze-interface';
import { FiltriComposizione } from 'src/app/features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ListaComposizioneVeloce } from '../../../shared/interface/lista-composizione-veloce-interface';

const BASE_URL = environment.baseUrl;
const API_URL_SOCCORSO_AEREO = BASE_URL + environment.apiUrl.gestioneSoccorsoAereo;
const API_URL_PREACCOPPIATI = BASE_URL + environment.apiUrl.composizione.preaccoppiati;
const API_URL_AVANZATA_SQUADRE = BASE_URL + environment.apiUrl.composizione.squadre;
const API_URL_AVANZATA_MEZZI = BASE_URL + environment.apiUrl.composizione.mezzi;
const API_URL_CONFERMA_PARTENZA = BASE_URL + environment.apiUrl.composizione.confermaPartenze;

@Injectable({
    providedIn: 'root'
})
export class CompPartenzaService {

    constructor(private http: HttpClient) {
    }

    getCategorieSoccorso(): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL_SOCCORSO_AEREO}/GetCategorie`);
    }

    getDettaglioSoccorsoAereo(codRichiesta: string): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL_SOCCORSO_AEREO}/GetInfo?requestKey=${codRichiesta}`);
    }

    getEventiSoccorsoAereo(codRichiesta: string): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL_SOCCORSO_AEREO}/GetStorico?requestKey=${codRichiesta}`);
    }

    addSoccorsoAereo(obj: any): Observable<any> {
        return this.http.post(`${API_URL_SOCCORSO_AEREO}/Inserisci`, obj);
    }

    removeSoccorsoAereo(obj: any): Observable<any> {
        return this.http.post(`${API_URL_SOCCORSO_AEREO}/Annulla`, obj);
    }

    getListaComposizioneVeloce(obj: FiltriComposizione): Observable<ListaComposizioneVeloce> {
        return this.http.post<ListaComposizioneVeloce>(API_URL_PREACCOPPIATI, obj);
    }

    getSquadreComposizioneAvanzata(obj: FiltriComposizione): Observable<SquadreComposizioneAvanzata> {
        return this.http.post<SquadreComposizioneAvanzata>(API_URL_AVANZATA_SQUADRE, obj);
    }

    getMezziComposizioneAvanzata(obj: FiltriComposizione): Observable<MezziComposizioneAvanzata> {
        return this.http.post<MezziComposizioneAvanzata>(API_URL_AVANZATA_MEZZI, obj);
    }

    confermaPartenze(partenze: ConfermaPartenze): Observable<any> {
        return this.http.post(API_URL_CONFERMA_PARTENZA, partenze);
    }
}
