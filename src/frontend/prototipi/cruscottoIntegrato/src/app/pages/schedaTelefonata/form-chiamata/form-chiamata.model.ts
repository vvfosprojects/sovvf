import { Geolocalizzazione } from "app/pages/shared/classes/geo/geolocalizzazione";

export class FormChiamataModel {
    numeroChiamata : string;
    istanteChiamata : number = Date.now();
    operatore : string;
    ragioneSociale: string;
    codiceSchedaContatto: string;
    codiciTipoIntervento: string[];
    cognome: string;
    nome: string;
    telefono : string;
   // coordinate : string;
    geolocalizzazione : Geolocalizzazione;
    indirizzo: string;
    zonaEmergenza : string;
    tags: string[];
    motivazione: string;
    noteIndirizzo: string;
    notePubbliche: string;
    notePrivate: string;
    azione: number;

    constructor(){
    }

    
}
