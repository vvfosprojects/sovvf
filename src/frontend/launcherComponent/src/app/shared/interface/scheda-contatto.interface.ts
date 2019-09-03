import { Richiedente } from '../model/richiedente.model';
import { Localita } from '../model/localita.model';
import { Priorita } from '../model/sintesi-richiesta.model';

export interface SchedaContatto {
    id: string;
    richiedente: Richiedente;
    localita: Localita;
    classificazioneEvento: string;
    categoria: string;
    dettaglio: string;
    priorita: Priorita;
    numeroPersoneCoinvolte: number;
    competenzaCC_PS: string;
    dataInserimento: string;
}
