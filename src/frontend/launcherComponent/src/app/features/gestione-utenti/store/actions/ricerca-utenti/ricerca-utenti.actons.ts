import { Sede } from '../../../../../shared/model/sede.model';

export class SetRicercaUtenti {
    static readonly type = '[RicercaUtenti] Set Ricerca';

    constructor(public ricerca: any) {
    }
}

export class ClearRicercaUtenti {
    static readonly type = '[RicercaUtenti] Clear Ricerca';
}

export class SetSediFiltro {
    static readonly type = '[RicercaUtenti] Set Sedi Filtro';

    constructor(public sedi: any[]) {
    }
}

export class ClearSediFiltro {
    static readonly type = '[RicercaUtenti] Clear Sedi Filtro';
}

export class ReducerSelezioneFiltroSede {
    static readonly type = '[RicercaUtenti] Reducer Selezione Filtro Sede';

    constructor(public sedeFiltro: string) {
    }
}
export class SetSedeFiltroSelezionato {
    static readonly type = '[RicercaUtenti] Set Sede Filtro Selezionato';

    constructor(public sedeFiltro: string) {
    }
}

export class SetSedeFiltroDeselezionato {
    static readonly type = '[RicercaUtenti] Clear Sede Filtro Selezionato';

    constructor(public sedeFiltro: string) {
    }
}
