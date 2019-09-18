// Model
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';

// GET
export class GetFiltriRichieste {
    static readonly type = '[FiltriRichieste] Get Filtri Richieste';
}

// SET FILTRO SELEZIONATO (SELEZIONATO, NON SELEZIONATO)
export class SetFiltroSelezionato {
    static readonly type = '[FiltriRichieste] Toggle filtro';

    constructor(public filtro: VoceFiltro) {}
}

// RESET FILTRI SELEZIONATI
export class ResetFiltriSelezionati {
    static readonly type = '[FiltriRichieste] Reset dei filtri selezionati';
}
