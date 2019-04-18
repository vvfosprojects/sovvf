// Model
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';

export class GetBoxPersonale {
    static readonly type = '[BoxPersonale] Get data';
    constructor(public connectionId: string) {
    }
}

export class SetBoxPersonale {
    static readonly type = '[BoxPersonale] Set data';

    constructor(public payload: BoxPersonale) {
    }
}

export class ClearBoxPersonale {
    static readonly type = '[BoxPersonale] Clear data';
}
