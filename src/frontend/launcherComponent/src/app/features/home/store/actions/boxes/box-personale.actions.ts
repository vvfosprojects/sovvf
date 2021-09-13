import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';

export class SetBoxPersonaleCurrent {
    static readonly type = '[BoxPersonale] Set data Current';

    constructor(public payload: BoxPersonale) {
    }
}

export class SetBoxPersonaleQtyCurrent {
    static readonly type = '[BoxPersonale] Set Personale Qty Current';

    constructor(public personaleQty: BoxPersonaleQty) {
    }
}

export class SetBoxPersonalePresenzeCurrent {
    static readonly type = '[BoxPersonale] Set Personale Presenze Current';

    constructor(public personalePresenze: BoxPersonalePresenze) {
    }
}

export class ClearBoxPersonale {
    static readonly type = '[BoxPersonale] Clear data';
}
