export class SetNewVersion {
    static readonly type = '[NewVersion] Set New Version Value';

    constructor(public value: boolean) {
    }
}

export class GetNewVersion {
    static readonly type = '[NewVersion] Get New Version';
}
