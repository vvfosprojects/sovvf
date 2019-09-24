import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';

export class SetTipologicheMezzi {
    static readonly type = '[FiltriComposizione] Set Filtri Composizione';

    constructor(public tipologiche: ListaTipologicheMezzi) {
    }
}
