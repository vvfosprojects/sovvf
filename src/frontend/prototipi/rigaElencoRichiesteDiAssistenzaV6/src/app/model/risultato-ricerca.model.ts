import { SintesiRichiesta } from '../model/sintesi-richiesta.model';

export class RisultatoRicerca {
    constructor(
        /* Numero di risultati */
        risultati: number,

        /* Numero di interventi corrispondenti ai criteri di ricerca */
        interventi: number,

        /* Numero di interventi totali */
        interventiComplessivi: number,

        /* Risultati */
        richieste: SintesiRichiesta
    ) {
    }
}
