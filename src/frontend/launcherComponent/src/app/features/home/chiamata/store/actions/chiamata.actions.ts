export class FetchIdChiamata {
    static readonly type = '[IdChiamata] Fetch data';
}

export class SetIdChiamata {
    static readonly type = '[IdChiamata] Set data';

    constructor(public payload: string) {}
}
