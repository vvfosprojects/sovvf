export class GetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Get Lista Filtri';
}

export class SetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Set Lista Filtri';
}

export class SetFiltriDistaccamentoDefault {
    static readonly type = '[FiltriComposizione] Set Filtri Distaccamento Default';

    constructor(public distaccamenti: any[]) {
    }
}

export class SetFiltriGeneriMezzoTriage {
    static readonly type = '[FiltriComposizione] Set Filtri Generi Mezzo Triage';

    constructor(public generiMezzo: string[]) {
    }
}

export class AddFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Add Filtro Selezionato';

    constructor(public id: string, public tipoFiltro: string) {
    }
}

export class RemoveFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtro Selezionato';

    constructor(public id: string, public tipoFiltro: string) {
    }
}

export class ResetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Reset Filtri Composizione';

    constructor(public tipoFiltro: string) {
    }
}

export class ClearFiltriComposizione {
    static readonly type = '[FiltriComposizione] Clear Filtri Composizione';
}
