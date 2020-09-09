import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';

export class GetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Get Lista Filtri';
}

export class SetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Set Lista Filtri';
}

export class SetListaFiltriAffini {
    static readonly type = '[FiltriComposizione] Set Lista Filtri Affini';

    constructor(public composizioneMezzi?: MezzoComposizione[]) {
    }
}

export class ClearFiltriAffini {
    static readonly type = '[FiltriComposizione] Clear Filtri Affini';
}

export class AddFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Add Filtro Selezionato';

    constructor(public id: string, public tipo: string) {
    }
}

export class RemoveFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtro Selezionato';

    constructor(public id: string, public tipo: string) {
    }
}

export class RemoveFiltriSelezionatiComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtri Selezionati';

    constructor(public tipo: string) {
    }
}
