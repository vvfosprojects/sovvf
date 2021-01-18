import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';

export class GetDettagliTipologie {
    static readonly type = '[DettagliTipologie] Get Dettagli Tipologie';

    constructor(public page?: number) {
    }
}

export class SetDettagliTipologie {
    static readonly type = '[DettagliTipologie] Set Dettagli Tipologie';

    constructor(public dettagliTipologie: DettaglioTipologia[]) {
    }
}

export class SetRicercaDettagliTipologie {
    static readonly type = '[DettagliTipologie] Set Ricerca Dettagli Tipologie';

    constructor(public ricerca: string) {
    }
}

export class ClearRicercaDettagliTipologia {
    static readonly type = '[DettagliTipologie] Clear Ricerca Dettagli Tipologie';
}

export class AddDettaglioTipologia {
    static readonly type = '[DettagliTipologie] Add Dettaglio Tipologia';
}

export class UpdateDettaglioTipologia {
    static readonly type = '[DettagliTipologie] Update Dettaglio Tipologia';

    constructor(public dettaglioTipologia: DettaglioTipologia) {
    }
}

export class DeleteDettaglioTipologia {
    static readonly type = '[DettagliTipologie] Delete Dettaglio Tipologia';

    constructor(public codiceDettaglioTipologia: number) {
    }
}


/**
 * Filtri Tipologie
 */
export class ReducerSelezioneFiltroTipologia {
    static readonly type = '[DettagliTipologie] Reducer Selezione Filtro Tipologia';

    constructor(public codTipologia: number) {
    }
}

export class SetFiltroTipologiaSelezionato {
    static readonly type = '[DettagliTipologie] Set Filtro Tipologia Selezionato';

    constructor(public codTipologia: number) {
    }
}

export class SetFiltroTipologiaDeselezionato {
    static readonly type = '[DettagliTipologie] Set Filtro Tipologia Deselezionato';
}

export class ResetFiltroTipologiaSelezionato {
    static readonly type = '[DettagliTipologie] Reset Filtro Tipologia Selezionato';
}
