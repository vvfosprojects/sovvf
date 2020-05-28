import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';

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

export class SetFiltroTipologiaSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Set Filtro Tipologia Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {}
}

export class ClearFiltroTipologiaSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Clear Filtro Tipologia Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {}
}

export class ApplyFiltriTipologiaSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Apply Filtri Tipologia Richieste Selezionati';
}

export class ClearAllFiltriTipologiaSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Clear All Filtri Tipologia Richieste Selezionati';
}

export class ResetFiltriSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Reset Filtri Richieste Selezionati';
}
