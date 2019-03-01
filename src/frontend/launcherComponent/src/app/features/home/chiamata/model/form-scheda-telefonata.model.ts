import { Localita } from 'src/app/shared/model/localita.model';

export class FormChiamataModel {
    numeroChiamata?: string;
    istanteChiamata?: number;
    idOperatore?: string;
    ragioneSociale?: string;
    schedaContatto?: string;
    tipoIntervento?: any[] = [];
    cognome?: string;
    nome?: string;
    telefono?: string;
    localita?: Localita;
    indirizzo?: string;
    zonaEmergenza?: string;
    tags?: string[];
    motivazione?: string;
    noteIndirizzo?: string;
    notePubbliche?: string;
    notePrivate?: string;

    constructor(idChiamata: string, _idOperatore: string, _schedaContatto?: string) {
        this.numeroChiamata = idChiamata;
        this.idOperatore = _idOperatore;
        this.schedaContatto = _schedaContatto;
        this.istanteChiamata = Date.now();
    }
}
