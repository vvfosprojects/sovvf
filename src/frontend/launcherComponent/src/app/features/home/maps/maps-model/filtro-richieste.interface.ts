import { Priorita } from '../../../../shared/model/sintesi-richiesta.model';

export interface FiltroRichieste {
    stato?: string[];
    priorita?: Priorita;
}
