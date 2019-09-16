import { Priorita } from '../../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';

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

export class UpdateStatiMezzi {
    static readonly type = '[Filtri Markers] Update Stati  Mezzi';

    constructor(public statiFiltro: StatoMezzo[]) {
    }
}

export class UpdateTipologieMezzi {
    static readonly type = '[Filtri Markers] Update Tipologie  Mezzi';

    constructor(public tipologie: string[]) {
    }
}
