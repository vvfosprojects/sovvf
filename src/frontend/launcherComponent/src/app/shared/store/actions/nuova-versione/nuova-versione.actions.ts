export class SetNewVersion {
    static readonly type = '[NewVersion] Set New Version Value';

    constructor(public newVersion: string) {
    }
}

export class SetCurrentVersion {
    static readonly type = '[NewVersion] Set Current Version Value';

    constructor(public currentVersion: string) {
    }
}

export class GetNewVersion {
    static readonly type = '[NewVersion] Get New Version';
}
