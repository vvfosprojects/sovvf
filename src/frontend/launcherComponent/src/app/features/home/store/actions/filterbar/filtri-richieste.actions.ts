import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';

export class GetFiltriRichieste {
    static readonly type = '[FiltriRichieste] Get Filtri Richieste';
}

export class SetFiltroSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Set Filtro Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {}
}

export class ClearFiltroSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Clear Filtro Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {}
}

export class ResetFiltriSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Reset Filtri Richieste Selezionati';
}
