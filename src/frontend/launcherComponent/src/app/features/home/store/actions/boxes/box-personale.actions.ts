import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';

export class GetBoxPersonale {
    static readonly type = '[BoxPersonale] Get all data';
}

export class SetBoxPersonale {
    static readonly type = '[BoxPersonale] Set all data';

    constructor(public payload: BoxPersonale) {
    }
}

export class SetBoxPersonalePrevious {
    static readonly type = '[BoxPersonale] Set data Previous';

    constructor(public payload: BoxPersonale) {
    }
}

export class SetBoxPersonaleQtyPrevious {
    static readonly type = '[BoxPersonale] Set Personale Qty Previous';

    constructor(public personaleQty: BoxPersonaleQty) {
    }
}

export class SetBoxPersonalePresenzePrevious {
    static readonly type = '[BoxPersonale] Set Personale Presenze Previous';

    constructor(public personalePresenze: BoxPersonalePresenze) {
    }
}

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

export class SetBoxPersonaleNext {
    static readonly type = '[BoxPersonale] Set data Next';

    constructor(public payload: BoxPersonale) {
    }
}

export class SetBoxPersonaleQtyNext {
    static readonly type = '[BoxPersonale] Set Personale Qty Next';

    constructor(public personaleQty: BoxPersonaleQty) {
    }
}

export class SetBoxPersonalePresenzeNext {
    static readonly type = '[BoxPersonale] Set Personale Presenze Next';

    constructor(public personalePresenze: BoxPersonalePresenze) {
    }
}

export class ClearBoxPersonale {
    static readonly type = '[BoxPersonale] Clear data';
}
