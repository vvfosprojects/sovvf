import { VersionResponseInterface } from '../../../interface/version-response.interface';

export class SetNewVersion {
    static readonly type = '[NewVersion] Set New Version Value';

    constructor(public newVersion: VersionResponseInterface) {
    }
}

export class SetCurrentVersion {
    static readonly type = '[NewVersion] Set Current Version Value';

    constructor(public currentVersion: VersionResponseInterface) {
    }
}

export class GetNewVersion {
    static readonly type = '[NewVersion] Get New Version';
}
