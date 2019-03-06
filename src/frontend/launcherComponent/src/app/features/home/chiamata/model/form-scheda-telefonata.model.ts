import { Localita } from 'src/app/shared/model/localita.model';
import { AzioneChiamataEnum } from '../../../../shared/enum/azione-chiamata.enum';

export class FormChiamataModel {
    numeroChiamata?: string;
    istanteChiamata?: Date;
    idOperatore?: string;
    ragioneSociale?: string;
    idSchedaContatto?: string;
    idTipoIntervento?: string[] = [];
    cognome?: string;
    nome?: string;
    telefono?: string;
    localita?: Localita;
    indirizzo?: string;
    zonaEmergenza?: string[];
    tags?: string[];
    motivazione?: string;
    noteIndirizzo?: string;
    notePubbliche?: string;
    notePrivate?: string;
    azione?: AzioneChiamataEnum;

    constructor(idChiamata: string, _idOperatore: string, _idSchedaContatto?: string) {
        this.numeroChiamata = idChiamata;
        this.idOperatore = _idOperatore;
        this.idSchedaContatto = _idSchedaContatto;
        this.istanteChiamata = new Date();
    }
}
