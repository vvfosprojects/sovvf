import { Richiedente } from '../model/richiedente.model';
import { Localita } from '../model/localita.model';
import { Tipologia } from '../model/tipologia.model';

export interface SchedaContatto {
    id: string;
    richiedente: Richiedente;
    localita: Localita;
    dataInserimento: string;
    note: string;
    tipologie?: Tipologia[];
}
