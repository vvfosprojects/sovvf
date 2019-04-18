// Model
import { BoxMezzi } from '../../../boxes/boxes-model/box-mezzi.model';

export class GetBoxMezzi {
    static readonly type = '[BoxMezzi] Get data';

    constructor(public connectionId: string ) {
    }
}

export class SetBoxMezzi {
    static readonly type = '[BoxMezzi] Set data';

    constructor(public payload: BoxMezzi) {
    }
}

export class ClearBoxMezzi {
    static readonly type = '[BoxMezzi] Clear data';
}
