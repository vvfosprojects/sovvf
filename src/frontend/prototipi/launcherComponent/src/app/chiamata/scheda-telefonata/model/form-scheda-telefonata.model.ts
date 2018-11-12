import { Tipologia } from 'src/app/shared/model/tipologia.model';
import { Localita } from 'src/app/shared/model/localita.model';

export class FormChiamataModel {
    numeroChiamata: string;
    istanteChiamata: number = Date.now();
    operatore: string;
    ragione_sociale: string;
    scheda_contatto: string;
    tipo_interv: Tipologia[];
    cognome: string;
    nome: string;
    telefono: string;
    coordinate: Localita;
    indirizzo: string;
    zona_emergenza: string;
    tags: string[];
    motivazione: string;
    note_indirizzo: string;
    note_pubbliche: string;
    note_private: string;

    constructor() {
    }
}
