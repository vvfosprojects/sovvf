import { ListaFiltriComposizione } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';

export class SetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Set Filtri Composizione';

    constructor(public filtri: ListaFiltriComposizione) {
    }
}
