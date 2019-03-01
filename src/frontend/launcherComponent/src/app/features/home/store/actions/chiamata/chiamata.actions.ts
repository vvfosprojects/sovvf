export class GetIdChiamata {
    static readonly type = '[IdChiamata] Get data';
}

export class SetIdChiamata {
    static readonly type = '[IdChiamata] Set data';

    constructor(public payload: string) {
    }
}
