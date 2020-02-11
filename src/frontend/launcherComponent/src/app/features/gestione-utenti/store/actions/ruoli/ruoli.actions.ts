export class GetRuoli {
    static readonly type = '[Ruoli] Get ruoli';
}

export class SetRuoli {
    static readonly type = '[Ruoli] Set ruoli';

    constructor(public ruoli: any[]) {
    }
}
