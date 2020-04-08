import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';

export class SetBoxPersonale {
    static readonly type = '[BoxPersonale] Set data';

    constructor(public payload: BoxPersonale) {
    }
}

export class SetBoxPersonaleQty {
    static readonly type = '[BoxPersonale] Set Personale Qty';

    constructor(public personaleQty: BoxPersonaleQty) {
    }
}

export class SetBoxPersonalePresenze {
    static readonly type = '[BoxPersonale] Set Personale Presenze';

    constructor(public personalePresenze: BoxPersonalePresenze) {
    }
}

export class ClearBoxPersonale {
    static readonly type = '[BoxPersonale] Clear data';
}
