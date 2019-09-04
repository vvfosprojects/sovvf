import { Richiedente } from '../model/richiedente.model';
import { Localita } from '../model/localita.model';
import { Priorita } from '../model/sintesi-richiesta.model';

export interface SchedaContatto {
    id: string;
    dataInserimento: string;
    richiedente: Richiedente;
    localita: Localita;
    classificazioneEvento: string;
    categoria: string;
    competenzaCC_PS: string;
    dettaglio: string;
    priorita: Priorita;
    numeroPersoneCoinvolte: number;
}
