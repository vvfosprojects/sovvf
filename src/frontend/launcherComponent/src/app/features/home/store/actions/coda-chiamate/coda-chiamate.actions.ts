import { ItemChartEmit } from '../../../../../shared/interface/item-chart.interface';
import { ChangeCodaChiamate } from '../../../../../shared/interface/change-coda-chiamate.interface';

export class GetDataGrafico {
    static readonly type = '[CodaChiamate] Get Data Grafico';
}

export class SortDataGrafico {
    static readonly type = '[CodaChiamate] Sort Data Grafico';
}

export class OpenModalDettaglioDistaccamento {
    static readonly type = '[CodaChiamate] Open Modal Dettaglio Distaccamento';

    constructor(public item: ItemChartEmit) {
    }
}

export class AddChiamateDistaccamentoCodaChiamate {
    static readonly type = '[CodaChiamate] Add Chiamate Distaccamento Coda Chiamate';

    constructor(public changes: ChangeCodaChiamate) {
    }
}

export class AddSquadreLibereDistaccamentoCodaChiamate {
    static readonly type = '[CodaChiamate] Add Squadre Libere Distaccamento Coda Chiamate';

    constructor(public changes: ChangeCodaChiamate) {
    }
}

export class AddSquadreOccupateDistaccamentoCodaChiamate {
    static readonly type = '[CodaChiamate] Add Squadre Occupate Distaccamento Coda Chiamate';

    constructor(public changes: ChangeCodaChiamate) {
    }
}

export class RemoveChiamateDistaccamentoCodaChiamate {
    static readonly type = '[CodaChiamate] Remove Chiamate Distaccamento';

    constructor(public changes: ChangeCodaChiamate) {
    }
}

export class RemoveSquadreLibereDistaccamentoCodaChiamate {
    static readonly type = '[CodaChiamate] Remove Squadre Libere Distaccamento Coda Chiamate';

    constructor(public changes: ChangeCodaChiamate) {
    }
}

export class RemoveSquadreOccupateDistaccamentoCodaChiamate {
    static readonly type = '[CodaChiamate] Remove Squadre Occupate Distaccamento Coda Chiamate';

    constructor(public changes: ChangeCodaChiamate) {
    }
}

export class StartLoadingCodaChiamate {
    static readonly type = '[CodaChiamate] Start Loading Coda Chiamate';
}

export class StopLoadingCodaChiamate {
    static readonly type = '[CodaChiamate] Stop Loading Coda Chiamate';
}
