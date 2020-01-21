export class GetPermessi {
    static readonly type = '[Permessi] Get permessi';
}

export class SetPermessi {
    static readonly type = '[Permessi] Set permessi';

    constructor(public permessi: any[]) {
    }
}
