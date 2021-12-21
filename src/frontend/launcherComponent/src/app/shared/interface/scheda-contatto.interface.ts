import { Richiedente } from '../model/richiedente.model';
import { Localita } from '../model/localita.model';
import { Priorita } from '../model/sintesi-richiesta.model';
import { ClassificazioneSchedaContatto } from '../enum/classificazione-scheda-contatto.enum';

export interface SchedaContatto {
    codiceScheda: string;
    codiceSede: string;
    dataInserimento: Date;
    richiedente: Richiedente;
    localita: Localita;
    classificazioneEvento: string;
    codiceInterventoAssociato: string;
    categoria: string;
    enteCompetenza: string;
    dettaglio: string;
    priorita: Priorita;
    numeroPersoneCoinvolte: string;
    operatoreChiamata: OperatoreSchedaContatto;
    classificazione: ClassificazioneSchedaContatto;
    gestita: boolean;
    collegate?: SchedaContatto[];
    collegata?: boolean;
}

interface OperatoreSchedaContatto {
    codiceFiscale: string;
    codicePostazioneOperatore: string;
    codiceSede: string;
}
