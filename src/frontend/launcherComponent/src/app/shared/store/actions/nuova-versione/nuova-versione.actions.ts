import { VersionInterface } from '../../../interface/version.interface';

export class SetNewVersion {
    static readonly type = '[NewVersion] Set New Version Value';

    constructor(public newVersion: VersionInterface) {
    }
}

export class SetCurrentVersion {
    static readonly type = '[NewVersion] Set Current Version Value';

    constructor(public currentVersion: VersionInterface) {
    }
}

export class GetNewVersion {
    static readonly type = '[NewVersion] Get New Version';
}
