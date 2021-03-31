import { ItemChartEmit } from '../../../../../shared/interface/item-chart.interface';

export class GetDataGrafico {
    static readonly type = '[CodaChiamate] Get Data Grafico';
}

export class OpenModalDettaglioDistaccamento {
    static readonly type = '[CodaChiamate] Open Modal Dettaglio Distaccamento';

    constructor(public item: ItemChartEmit) {
    }
}

export class StartLoadingCodaChiamate {
    static readonly type = '[CodaChiamate] Start Loading Coda Chiamate';
}

export class StopLoadingCodaChiamate {
    static readonly type = '[CodaChiamate] Stop Loading Coda Chiamate';
}
