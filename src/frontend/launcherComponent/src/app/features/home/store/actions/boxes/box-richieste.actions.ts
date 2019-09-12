import { BoxInterventi } from '../../../boxes/boxes-model/box-interventi.model';

export class SetBoxRichieste {
    static readonly type = '[BoxRichieste] Set data';

    constructor(public payload: BoxInterventi) {
    }
}

export class ClearBoxRichieste {
    static readonly type = '[BoxRichieste] Clear data';
}
