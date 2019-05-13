// Filtri Composizione
export class GetFiltriComposizione {
    static readonly type = '[FilterBarComposizione] Get Filtri';
}

export class SetFiltriComposizione {
    static readonly type = '[FilterBarComposizione] Set Filtri';

    constructor(public filtri: any) {
    }
}
