import { Localita } from 'src/app/shared/model/localita.model';

export class FormChiamataModel {
    numeroChiamata?: string;
    istanteChiamata?: number = Date.now();
    operatore?: string;
    ragioneSociale?: string;
    schedaContatto?: string;
    tipoIntervento?: any[] = [];
    cognome?: string;
    nome?: string;
    telefono?: string;
    coordinate?: Localita;
    indirizzo?: string;
    zonaEmergenza?: string;
    tags?: string[];
    motivazione?: string;
    noteIndirizzo?: string;
    notePubbliche?: string;
    notePrivate?: string;

    constructor() {
    }
}
