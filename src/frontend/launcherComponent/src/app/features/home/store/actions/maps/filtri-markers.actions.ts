import { Priorita } from '../../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';

export class SetPropritaRichiesta {
    static readonly type = '[Filtri Markers] Set Priorita Richiesta';

    constructor(public priorita: Priorita) {
    }
}

export class UpdateStatiRichiesta {
    static readonly type = '[Filtri Markers] Update Stati  Richiesta';

    constructor(public statiFiltro: StatoRichiesta[]) {
    }
}
