// Model
import { VoceFiltro } from '../../voce-filtro.model';

// GET
export class GetFiltriRichieste {
    static readonly type = '[FiltriRichieste] Get Filtri Richieste';
}

// SET FILTRO SELEZIONATO (SELEZIONATO, NON SELEZIONATO)
export class SetFiltroSelezionato {
    static readonly type = '[FiltriRichieste] Set filtro state (selezionato, non selezionato)';

    constructor(public filtro: VoceFiltro) {}
}

// ADD FILTRO SELEZIONATO
export class AddFiltroSelezionato {
    static readonly type = '[FiltriRichieste] Filtro aggiunto ai selezionati';

    constructor(public filtro: VoceFiltro) {}
}

// REMOVE FILTRO SELEZIONATO
export class RemoveFiltroSelezionato {
    static readonly type = '[FiltriRichieste] Filtro rimosso dai selezionati';

    constructor(public filtro: VoceFiltro) {}
}

// RESET FILTRI SELEZIONATI
export class ResetFiltriSelezionati {
    static readonly type = '[FiltriRichieste] Reset dei filtri selezionati';
}
